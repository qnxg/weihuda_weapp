import React, { useCallback, useEffect, useMemo, useState } from "react";
import CardProps, { useIsLoadingCountZero } from "../CardProps";

/** 半BUG: 当卡片内组件列表发生了变化时请销毁这个组件重新渲染（使用key），
 * 否则loadingCount会出现异常。
 * 这是由于loadingCount使用了useRef造成的
 * 
 * edit: 
 * 现在卡片设置页面在保存退出后会重新加载首页，
 * 这样一来用户不需要设置后还回到首页刷新，
 * 也不需要用key来使这个组件在刷新前销毁了
 */
const ConfigurableCardList = <K extends React.Key,>(props: {
    /** 置顶的卡片 */
    topCards: [React.Key, React.FC<CardProps>][]
    /** 可配置的卡片列表 */
    customizableCards: Map<K, React.FC<CardProps>>
    /** 卡片设置 */
    CardsToShow: Set<K>
    /** 在所有卡片（含置顶的和用户设置的）加载完成后触发 */
    onAllLoadFinished: () => unknown
    /** 如果改变，则重新加载所有卡片的数据 */
    reloadAllController: unknown
}) => {
    /**
     * 忽略所有不存在的卡片名称
    */
    const mapKeyInfo = useCallback(
        (k: K): [K, React.FC<CardProps>][] => {
            const v = props.customizableCards.get(k)
            return v ? [[k, v]] : []
        }
        , [props.customizableCards]
    )

    const childrenList = useMemo(
        () => [
            // 置顶的，用户无法设置的卡片
            ...props.topCards,
            // 要显示的卡片
            ...props.CardsToShow
                .keys()
                .flatMap(mapKeyInfo),
        ],
        [props.topCards, props.CardsToShow, mapKeyInfo]
    )

    const onAllLoadFinished = props.onAllLoadFinished;
    // 根据CardProp里的要求，
    // 第一次渲染会触发onOneFetchStatusChange(false)
    // 后续请求开始执行会触发onOneFetchStatusChange(true)
    // 请求完成后会触发onOneFetchStatusChange(false)
    // 需要设置一定的LoadingCount初始值
    // 由于第一次渲染时loadingCount可能暂时会减到0
    // 需要设置一定的时间防止onFetchDataFinished触发
    const [isFetchDataFinished, onOneFetchStatusChange] =
        useIsLoadingCountZero(childrenList.length);
    const [enableOnFetchDataFinished, setEnableOnFetchDataFinished] =
        useState(false);
    useEffect(() => {
        setEnableOnFetchDataFinished(false)
        // 500ms内不会认为请求完成
        setTimeout(() => setEnableOnFetchDataFinished(true), 500)
    }, [props.reloadAllController])
    useEffect(() => {
        if (isFetchDataFinished && enableOnFetchDataFinished) {
            onAllLoadFinished()
        }
    }, [isFetchDataFinished, enableOnFetchDataFinished, onAllLoadFinished]);

    return <>{childrenList.map(
        ([cardKey, Card]) =>
            <Card
                key={cardKey}
                onLoadingStatusChange={onOneFetchStatusChange}
                reloadController={props.reloadAllController}
            />
    )}</>
};

export default ConfigurableCardList;