import { useCallback, useSyncExternalStore } from 'react'

export type GlobalDict<K, V> = {
  /**
   * 一个用于订阅某个键对应的值的React Hook
   *
   * @returns 一个状态，跟踪所给键对应的值。当值变化时组件更新会被触发。
   */
  readonly use: (k: K) => V
  /**
   * 获取当前某个键对应的值
   */
  readonly get: (k: K) => V
  /**
   * 设置某个键对应的值
   *
   * 该函数会触发所给键的订阅者
   */
  readonly set: (k: K, v: V) => void
  /**
   * 清除某个键及其对应值的存储，随后的获取将返回默认值
   *
   * 该函数会触发所给键的订阅者
   */
  readonly del: (k: K) => void
  /**
   * @deprecated Don't use it unless you know what you are doing.
   */
  readonly internalPayloadMap: Map<K, V>
  /**
   * @deprecated Don't use it unless you know what you are doing.
   */
  readonly internalSubscribersMap: Map<K, Set<() => void>>
}

/**
 * 创建非持久化的全局字典
 */
function createGlobalDict<K, V>(defaultVal: (k: K) => V): GlobalDict<K, V> {
  const globalDict = new Map<K, V>()
  const subscribeDict = new Map<K, Set<() => void>>()

  const getSubscribes = (k: K): Set<() => void> => {
    let s = subscribeDict.get(k)
    if (s === undefined) {
      s = new Set()
    }
    subscribeDict.set(k, s)
    return s
  }

  const notice = (k: K) => {
    const subscribes = subscribeDict.get(k)
    if (subscribes) {
      Array.from(subscribes).forEach(f => f())
    }
  }

  const get = (k: K): V => {
    if (globalDict.has(k)) {
      return globalDict.get(k) as V
    } else {
      const v = defaultVal(k)
      globalDict.set(k, v)
      return v
    }
  }

  const set = (k: K, v: V) => {
    if (Object.is(globalDict.get(k), v)) return
    globalDict.set(k, v)
    notice(k)
  }

  const del = (k: K) => {
    globalDict.delete(k)
    notice(k)
  }

  const use = (k: K): V => {
    const subscribe = useCallback(
      (cb: () => void) => {
        getSubscribes(k).add(cb)
        return () => {
          const subscribers = getSubscribes(k)
          subscribers.delete(cb)
          if (subscribers.size === 0) {
            subscribeDict.delete(k)
          }
        }
      },
      [k]
    )

    const getState = useCallback(() => get(k), [k])
    const state = useSyncExternalStore(subscribe, getState)
    return state
  }

  return {
    use,
    get,
    set,
    del,
    internalPayloadMap: globalDict,
    internalSubscribersMap: subscribeDict,
  }
}

export default createGlobalDict
