import Taro from "@tarojs/taro";
import { useCallback, useState } from "react";

/**
 * 设置是否在退出当前页面时relaunch到首页
 */
function useShouldRelaunchIndex(
    initial: boolean | (() => boolean)
): [React.Dispatch<React.SetStateAction<boolean>>, boolean] {
    const [shouldRelaunchIndex, setShouldRelaunchIndex] = useState<boolean>(initial);
    const unloadCallback = useCallback(() => {
        if (shouldRelaunchIndex) {
            void Taro.reLaunch({ url: '/pages/index/index' })
        }
    }, [shouldRelaunchIndex])
    Taro.useUnload(unloadCallback)
    return [setShouldRelaunchIndex, shouldRelaunchIndex]
}

export default useShouldRelaunchIndex