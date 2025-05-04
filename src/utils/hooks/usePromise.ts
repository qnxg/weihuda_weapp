import { DependencyList, useEffect, useState } from "react";

type PromiseErrorInfo = null | { thrown: unknown };


/**
 * 自定义Hook。用于进行异步操作并使用其结果渲染组件。
 *
 * @template T - Promise resolve时返回的类型
 * 
 * @param fn - 一个返回`Promise<T>`的函数。
 *   它在渲染间通常应该保持一致。如果传入的`fn`不再一致，新的`fn`会被立即触发。
 *   因此你可能需要使用`useCallback`包围传入的闭包
 * @param initialValue - `fn`第一次被调用且其Promise仍未resolve时缺省的结果值。
 *   用法和`useState`的第一个参数相同
 * @param deps - 触发重调用`fn`的依赖。
 *   如果为undefined，则每次渲染都会触发`fn`。
 *   否则，`fn`仅会在`deps`中的依赖或者`fn`变化时触发。
 *   和`useEffect`的依赖用法大致相同
 * 
 * @returns A tuple containing:
 * - `T`: Promise resolve的结果。
 *     当promise未resolve时为上一次resolve的结果（如果有），否则为`initialValue`
 * - `boolean`: 表示promise当前是否处于pending状态，初始值为false
 * - `PromiseError`: 如果promise出现异常，该值将包含抛出的错误信息。
 *     注意：这个值会在每次`fn`被调用前重置
 * 
 * @remarks
 * - The hook ensures that the state updates only if the component is still mounted.
 * 
 * @example
 * ```tsx
 * const fetchData = useCallback(async () => {
 *   // do something
 * }, [])
 * 
 * const [data, isLoading, error] = usePromise(
 *   fetchData,
 *   undefined,
 *   [] // `fetchData1`不会被重新触发
 * );
 * 
 * if (isLoading) return <p>Loading...</p>;
 * if (error) return <p>Error: {error.thrown.message}</p>;
 * return <p>Data: {data}</p>;
 * ```
 */
export default function usePromise<T>(
    fn: () => Promise<T>,
    initialValue: T | (() => T),
    deps?: DependencyList | undefined
): [
        T,
        boolean,
        PromiseErrorInfo,
    ] {
    const [promiseResult, setPromiseResult] = useState<T>(initialValue);
    const [isPromisePending, setIsPromisePending] = useState(false);
    const [promiseError, setPromiseError] = useState<PromiseErrorInfo>(null);

    useEffect(() => {
        let isMounted = true;
        ; (async () => {
            try {
                setPromiseError(null);
                setIsPromisePending(true);
                const res = await fn();
                if (!isMounted) return;
                setPromiseResult(res);
            } catch (e) {
                if (!isMounted) return;
                setPromiseError({ thrown: e });
            } finally {
                if (!isMounted) return;
                setIsPromisePending(false);
            }
        })();
        return () => { isMounted = false; }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps === undefined ? undefined : [fn, ...deps]);

    return [promiseResult, isPromisePending, promiseError];
}