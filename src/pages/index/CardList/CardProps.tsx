import { useCallback, useRef, useState } from 'react'

/**
 * 首页卡片应该满足这个`契约`。
 *
 * 详见字段上的注释。
 */
export default interface CardProps {
  /** 这个函数应该在每次开始请求时触发一次true，
   * 每次请求结束触发一次false
   *
   * @example
   ```tsx
    const [messageData, isMessageDataLoading] = usePromise(
      getMessage,
      [],
      [getMessage, reloadController]
    )

    const [noticeToShow, isLoadingNoticeToShow] = usePromise(
      getNoticeToShow,
      [],
      [getNoticeToShow, reloadController]
    )

    const combinedLoadingState = isMessageDataLoading || isLoadingNoticeToShow;

    useEffect(() => {
      onLoadingStatusChange(combinedLoadingState)
    }, [combinedLoadingState, onLoadingStatusChange])

    return <MessageCardDisplay message={messageData} noticeToShow={noticeToShow} />
   ```
   */
  onLoadingStatusChange: (isLoading: boolean) => any
  /** 当这一项变化时，卡片应该重新请求数据 */
  reloadController: any
}

type LoadingCountKey = string | symbol | number | bigint
/**
 * Hook to manage and track multiple loading states with a counter.
 *
 * @returns A tuple containing:
 *   - `loadingCount`: The current number of active loading operations
 *   - `statusHandler`: A function that takes a loading key and returns a callback to update its pending status
 *
 * @example
 * ```tsx
 * const [loadingCount, statusHandler] = useLoadingCounter();
 * const handleUserLoad = statusHandler('user');
 *
 * // Update loading status
 * handleUserLoad(true);  // Increment loading count
 * handleUserLoad(false); // Decrement loading count
 * ```
 *
 * @remarks
 * -  Uses `Map` to cache callbacks and track loading states for different keys
 * -  Automatically calculates and updates the total loading count
 * -  Callbacks are memoized per key to avoid unnecessary re-creation
 *    so they are stable for putting in dep arrays.
 */
export function useLoadingCounter(): [
  number,
  (key: LoadingCountKey) => (isPending: boolean) => void,
] {
  const loadingDict = useRef(new Map<LoadingCountKey, boolean>())
  const callbackDict = useRef(
    new Map<LoadingCountKey, (isPending: boolean) => void>()
  )
  const [loadingCount, setLoadingCount] = useState(0)
  const statusHandler = useCallback((key: LoadingCountKey) => {
    // 使回调函数的引用稳定，防止放入依赖数组后出现问题
    const cache = callbackDict.current.get(key)
    if (cache !== undefined) {
      return cache
    }
    const newCb = (isPending: boolean) => {
      if (isPending) {
        loadingDict.current.set(key, true)
      } else {
        loadingDict.current.set(key, false)
      }
      const currentLoadingCnt = loadingDict.current
        .values()
        .reduce((pv, cv) => (pv += cv ? 1 : 0), 0)
      setLoadingCount(currentLoadingCnt)
      console.log(`loadingCount.current == ${currentLoadingCnt}`)
    }
    callbackDict.current.set(key, newCb)
    return newCb
  }, [])
  return [loadingCount, statusHandler] as const
}
