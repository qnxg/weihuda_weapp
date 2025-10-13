import { useDidShow } from '@tarojs/taro'
import { useCallback, useState } from 'react'

/**
 * 这是一个记录当前页面的实例的显示次数的自定义Hook。
 *
 * @returns 一个state，值为当前页面的实例已显示次数
 */
function useShowCount(): bigint {
  const [cnt, setCnt] = useState(0n)
  const incCnt = useCallback(() => {
    setCnt(c => c + 1n)
  }, [])
  useDidShow(incCnt)
  return cnt
}

export default useShowCount
