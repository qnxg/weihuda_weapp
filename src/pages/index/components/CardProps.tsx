import { useCallback, useRef, useState } from "react"

/**
 * 首页卡片应该满足这个`契约`。
 * 
 * 详见字段上的注释。
 */
export default interface CardProps {
    /** 这个函数应该先被触发一次false，
     * 然后后续每次开始请求时触发一次true，
     * 请求结束触发一次false 
     * 
     * 满足这个要求的最简单方式是使用`usePromise`管理你的请求。
    */
    onLoadingStatusChange: (isLoading: boolean) => any
    /** 当这一项变化时，卡片应该重新请求数据 */
    reloadController: any
}

/**
 * A custom hook that tracks whether the loading count is zero.
 *
 * @param loadingCountInitial - The initial value of the loading count.
 * @returns A tuple containing:
 * - `isLoadingCountZero`: A boolean indicating whether the loading count is zero.
 * - `pendingStatusHandler`: A function to update the loading count based on the pending status.
 *   This function will not change so you can put it in dependency lists in such as `useEffect`.
 *
 * The `pendingStatusHandler` function accepts a boolean `isPending`:
 * - If `true`, it increments the loading count.
 * - If `false`, it decrements the loading count.
 * The hook updates the `isLoadingCountZero` state whenever the loading count changes.
 */
export function useIsLoadingCountZero(
    loadingCountInitial: number,
):
    [
        boolean,
        (isPending: boolean) => void,
    ] {
    const loadingCount = useRef(loadingCountInitial);
    const [isLoadingCountZero, setIsLoadingCountZero] =
        useState(loadingCountInitial == 0);
    const pendingStatusHandler = useCallback((isPending: boolean) => {
        if (isPending) {
            loadingCount.current += 1
        } else {
            loadingCount.current -= 1
        }
        const cntLog = `loadingCount.current == ${loadingCount.current}`;
        if (loadingCount.current < 0) {
            console.error(cntLog + ' 请检查对loading状态的处理')
        } else {
            console.log(cntLog)
        }
        setIsLoadingCountZero(loadingCount.current == 0)
    }, []);
    return [isLoadingCountZero, pendingStatusHandler]
}