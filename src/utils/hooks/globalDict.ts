import { useCallback, useSyncExternalStore } from 'react'

/**
 * 新建非持久化的全局字典，返回用于操作字典中状态的Hook
 */
function createGlobalDict<K, V>(
  defaultVal: (k: K) => V
): (k: K) => [V, () => V, (v: V) => void, () => void] {
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

  const setDict = (k: K, v: V) => {
    if (Object.is(globalDict.get(k), v)) return
    globalDict.set(k, v)
    notice(k)
  }

  const delDict = (k: K) => {
    globalDict.delete(k)
    notice(k)
  }

  function useGlobalDictValueFor(
    k: K
  ): [V, () => V, (v: V) => void, () => void] {
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
    const getState = useCallback(() => {
      if (globalDict.has(k)) {
        return globalDict.get(k) as V
      } else {
        const v = defaultVal(k)
        globalDict.set(k, v)
        return v
      }
    }, [k])
    const state = useSyncExternalStore(subscribe, getState)
    const setState = useCallback(
      (v: V) => {
        setDict(k, v)
      },
      [k]
    )
    const removeState = useCallback(() => delDict(k), [k])
    return [state, getState, setState, removeState]
  }

  return useGlobalDictValueFor
}

export default createGlobalDict
