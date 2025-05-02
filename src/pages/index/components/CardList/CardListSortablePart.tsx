import { View } from "@tarojs/components";
import React, { useEffect, useState } from "react";
import styles from './index.module.scss'
import CardProps, { useIsLoadingCountZero } from "../CardProps";

const CardListSort = (props: {
    childrenList: React.FC<CardProps>[],
    onAllLoadFinished: () => unknown
    reloadAllController: unknown
}) => {

    const onAllLoadFinished = props.onAllLoadFinished;
    // 由于usePromise返回的isPending初始值是false
    // 对于使用usePromise的请求而言
    // 第一次渲染会触发onOneFetchStatusChange(false)
    // 后续请求开始执行会触发onOneFetchStatusChange(true)
    // 请求完成后会触发onOneFetchStatusChange(false)
    // 需要设置一定的LoadingCount初始值
    // 需要设置一定的时间防止onFetchDataFinished触发
    const [isFetchDataFinished, onOneFetchStatusChange] =
        useIsLoadingCountZero(props.childrenList.length);
    const [enableOnFetchDataFinished, setEnableOnFetchDataFinished] =
        useState(false);
    useEffect(() => {
        setEnableOnFetchDataFinished(false)
        setTimeout(() => setEnableOnFetchDataFinished(true), 500)
    }, [props.reloadAllController])
    useEffect(() => {
        if (isFetchDataFinished && enableOnFetchDataFinished) {
            onAllLoadFinished()
        }
    }, [isFetchDataFinished, enableOnFetchDataFinished, onAllLoadFinished]);

    return <>{props.childrenList.map(
        (Card, idx) =>
            <Card
                key={idx}
                onLoadingStatusChange={onOneFetchStatusChange}
                reloadController={props.reloadAllController}
            />
    )}</>
};

export default CardListSort;