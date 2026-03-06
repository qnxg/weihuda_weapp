import Taro from '@tarojs/taro'
import { useEffect } from 'react'
import { getStorageAsyncNoExcept, setStorageAsync } from '../storage'
import request from '@/apis/request'
import createGlobalDict from '@/utils/hooks/globalDict'
import type { DependencyList } from 'react'

const CACHE_KEY_HEAD = 'REQCACHE'

function cacheKey(cacheKeyPayload: string[]): string {
  const payloadEnc = cacheKeyPayload.map(s => encodeURIComponent(s)).join('/')
  return `${CACHE_KEY_HEAD}/${payloadEnc}`
}

/**
 * 最近使用的缓存的键
 *
 * 为了简单不出问题，不持久化
 */
const recentlyUsedCacheKeys: Set<string> = new Set()
const RECENT_KEYS_LIMIT = 64
const usingCacheKey = (key: string) => {
  // 添加/移动至队尾
  recentlyUsedCacheKeys.delete(key)
  recentlyUsedCacheKeys.add(key)
  // 当容量已满删除队首
  if (recentlyUsedCacheKeys.size > RECENT_KEYS_LIMIT) {
    recentlyUsedCacheKeys.delete(recentlyUsedCacheKeys.keys().next().value)
  }
}

/**
 * 异步获取某个缓存
 *
 * 键的提升在返回Promise之前
 *
 * 这个函数不会抛出错误。找不到项目时返回undefined。
 */
function getCache(cacheKeyPayload: string[]): Promise<unknown> {
  const key = cacheKey(cacheKeyPayload)
  usingCacheKey(key)
  return getStorageAsyncNoExcept(key)
}

/**
 * 异步设置某个缓存，有概率触发缓存清理
 */
async function setCacheAndMaybeGC(
  cacheKeyPayload: string[],
  cacheValue: unknown
) {
  const key = cacheKey(cacheKeyPayload)
  usingCacheKey(key)

  /**
   * 触发清理的概率为a，清理时每个项目删除概率为b，则项目总个数不会远超过1/(ab)
   */
  const maybeGC = () => {
    const shouldGC = Math.random() * 32 < 1
    if (!shouldGC) return
    const { keys } = Taro.getStorageInfoSync()
    console.log('缓存清理已被触发')
    // O(n)
    keys
      .values()
      .filter(
        k =>
          k.startsWith(`${CACHE_KEY_HEAD}/`) &&
          !recentlyUsedCacheKeys.has(k) /* 完全不清理最近的key */ &&
          Math.random() * 8 < 1 /* 每次仅清理一部分，使缓存波动更小 */
      )
      .forEach(k => Taro.removeStorageSync(k))
  }

  try {
    await setStorageAsync(key, cacheValue)
  } finally {
    maybeGC()
  }
}

type Slot = {
  res: unknown
  error: { thrown: unknown } | null
  fetching: boolean
  gettingCache: boolean
}
const useSharedResult = createGlobalDict<string | undefined, Slot>(() => ({
  res: undefined,
  error: null,
  fetching: false,
  gettingCache: false,
}))
/**
 * 这是一个从后端GET接口请求JSON数据，并且自动进行缓存和消除并发重复请求的Hook。
 *
 * @param url - The base URL for the GET request. Must not contain query parameters.
 *    当该参数为`undefined`，缓存的获取与数据请求不会开始
 * @param query - An array of [key, value] tuples representing query parameters to be appended to the URL.
 *    当该参数为`undefined`，缓存的获取与数据请求不会开始
 * @param deps - React dependency list that triggers refetching when values change.
 *
 *
 * @returns 包含下列项目的数组:
 *   - `[0]` 从缓存或者请求响应中得到的数据。当暂未从缓存或者请求响应中得到数据时为`undefined`
 *   - `[1]` 是否正在从缓存中加载数据
 *   - `[2]` 是否正在进行请求
 *   - `[3]` 请求发生的错误，若无则为`null`
 *
 * @remarks
 * -  该Hook创建和返回的是在组件间共享的状态。
 *    例如，若有一系列组件以相同参数使用该Hook请求了相同接口，则当其中一个组件通过依赖数组
 *    触发了数据刷新时，其中的其他组件的对应数据也会根据请求返回的结果刷新。
 * -  不建议使用该Hook请求不值得缓存的接口，或者请求参数复杂的接口，或者请求参数易变的接口。
 *    首先，由于微信限制localStorage容量，该Hook管理的持久化缓存具有
 *    使缓存总数稳定于某个值附近的自动清理的措施，大量使用该Hook会造成 容量不命中 。
 *    其次，该Hook可能引发同步设置/删除localStorage、调用所有相关组件的订阅回调等同步操作，
 *    大量调用该Hook可能会造成用户可见的UI阻塞时间。
 *    然后，该Hook目前将当前应用实例中所有请求过的结果在内存中都留存了一份，且暂无自动清理措施，
 *    内存泄漏量取决于使用了该Hook的(接口,参数)的pair的多少和每个pair对应的响应的大小。
 *
 * @example
 * ```typescript
 * // 基本用法
 * const [data, gettingCache, fetching, error] = useCacheableGetJson(
 *   'https://api.example.com/users',
 *   [['page', '1'], ['limit', '10']],
 *   [refreshKey]
 * );
 * ```
 *
 * @example
 * ```tsx
 * // 这个示例中的组件并不需要这个接口的数据，
 * // 而是想要刷新用该Hook请求了对应接口的组件中的数据
 * const [refreshKey, refreshTrigger] = useRefreshKey()
 * const [] = useCacheableGetJson('/api/balabala', [], [refreshKey])
 * return <Button onClick={refreshTrigger}>刷新</Button>
 * ```
 */
export function useCacheableGetJson<T>(
  url: string | undefined,
  query: [string, string][] | undefined,
  deps: DependencyList
): readonly [
  T | undefined,
  boolean,
  boolean,
  { readonly thrown: unknown } | null,
] {
  if (url && url.includes('?')) {
    throw new Error('请求参数请通过query传入')
  }

  const normalizedURL =
    url !== undefined && query !== undefined
      ? url +
        '?' +
        query
          .toSorted()
          .map(
            ([qk, qv]) => `${encodeURIComponent(qk)}=${encodeURIComponent(qv)}`
          )
          .join('&')
      : undefined

  const [slotState, getSlot, setSlot] = useSharedResult(normalizedURL)

  // 从本地存储初始化
  useEffect(() => {
    if (normalizedURL === undefined) {
      return
    }
    void (async () => {
      let slot = getSlot()
      if (slot.gettingCache || slot.res !== undefined) {
        return
      }
      setSlot({
        ...slot,
        gettingCache: true,
      })

      const cachePromise = getCache([normalizedURL])
      const cache = await cachePromise
      slot = getSlot()
      if (!slot.gettingCache) {
        throw new Error('bug: !gettingCache')
      }
      if (slot.res === undefined) {
        setSlot({
          ...slot,
          res: cache,
          gettingCache: false,
        })
      } else {
        setSlot({
          ...slot,
          gettingCache: false,
        })
      }
    })()
  }, [getSlot, normalizedURL, setSlot])

  // 请求
  useEffect(() => {
    if (normalizedURL === undefined) {
      return
    }
    void (async () => {
      let slot = getSlot()
      // 合并并发请求
      if (slot.fetching) {
        return
      }
      setSlot({
        ...slot,
        fetching: true,
        error: null,
      })
      let res = undefined
      try {
        res = await request.get(normalizedURL)
        await setCacheAndMaybeGC([normalizedURL], res)
      } catch (e) {
        slot = getSlot()
        if (!slot.fetching) {
          throw new Error('bug: !fetching')
        }
        setSlot({
          ...slot,
          error: { thrown: e },
          fetching: false,
        })
        return
      }
      slot = getSlot()
      if (!slot.fetching) {
        throw new Error('bug: !fetching')
      }
      setSlot({
        ...slot,
        res,
        error: null,
        fetching: false,
      })
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getSlot, normalizedURL, setSlot, ...deps])

  return [
    slotState.res as T | undefined,
    slotState.gettingCache,
    slotState.fetching,
    slotState.error,
  ]
}
