import { useRef, useLayoutEffect } from 'react'

/**
 * TL;DR: 想要访问某个state但是又不想写进dep数组，可能可以用这个
 *
 * React state hook that stores the latest version of a value.
 *
 * This can be used to access the latest ("fresh") value of some props or state
 * inside an event handler or `useLayoutEffect()`
 * **without specifying the value in a dependency array**.
 * This hook provides the latest value even when the ref is accessed in a `useLayoutEffect()`.
 *
 * @example
 * ```jsx
 * const Demo = () => {
 * const [count, setCount] = React.useState(0);
 * const latestCount = useLayoutLatestRef(count);
 * function handleAlertClick() {
 *     setTimeout(() => {
 *     alert(`Latest count value: ${latestCount.current}`);
 *     }, 3000);
 * }
 * return (
 *     <div>
 *     <p>You clicked {count} times</p>
 *     <button onClick={() => setCount(count + 1)}>Click me</button>
 *     <button onClick={handleAlertClick}>Show alert</button>
 *     </div>
 * );
 * };
 * ```
 *
 * @see https://github.com/streamich/react-use/pull/2509
 */
export default function useLayoutLatestRef<T>(value: T) {
  const ref = useRef<T>(value)
  useLayoutEffect(() => {
    ref.current = value
  }, [value])
  return ref
}
