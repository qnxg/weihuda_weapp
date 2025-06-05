import { useCallback, useState } from 'react'

/**
 * 一个[custom hook](https://react.dev/learn/reusing-logic-with-custom-hooks)。
 * 返回值的第一项是一个state，第二项是一个改变它的函数。
 */
export default function useRefreshKey(): [bigint, () => void] {
  const [refreshKey, setRefreshKey] = useState(0n)
  const trigger = useCallback(() => setRefreshKey(v => v + 1n), [])
  return [refreshKey, trigger]
}
