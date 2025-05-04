import { useState } from "react";

/**
 * 一个[custom hook](https://react.dev/learn/reusing-logic-with-custom-hooks)。
 * 返回值的第一项是一个state，第二项是一个改变它的函数。
 */
export default function useRefreshKey(): [number, () => void] {
    const [refreshKey, setRefreshKey] = useState(0);
    return [refreshKey, () => setRefreshKey(v => v + 1)];
}