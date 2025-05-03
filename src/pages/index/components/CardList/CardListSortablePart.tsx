import React, { useCallback, useEffect, useMemo, useState } from "react";
import CardProps, { useIsLoadingCountZero } from "../CardProps";

export type CustomizableCardsConfig<K extends React.Key> = {
    /** 为了设置的后向兼容，
     * 当该值与取到的设置中的值不同时用户设置会被忽略，
     * 直到用户重新设置
     */
    configMajorVersion: string;
    /** 首页可以自定义出现与否与顺序的卡片 */
    customizableCards: Map<K, React.FC<CardProps>>
}

export type UserCardDisplaySetting<K extends React.Key> = {
    configMajorVersion: string
    show: Set<K>
    /** 为了设置的后向兼容，
     * 如果一个卡片既没有在show中也没有在dontShow中，
     * 它就会被添加到页面的末尾显示。
     * 多个这种情况的卡片的排序按照默认设置中的优先级。
     */
    dontShow: Set<K>
};

const CardListSortablePart = <K extends React.Key,>(props: {
    customizableCardsConfig: CustomizableCardsConfig<K>
    userCardDisplaySetting: UserCardDisplaySetting<K>
    defaultCardDisplaySetting: UserCardDisplaySetting<K>
    onAllLoadFinished: () => unknown
    reloadAllController: unknown
}) => {

    // 如果主版本不匹配，则完全使用默认设置
    const useSetting =
        (props.customizableCardsConfig.configMajorVersion ==
            props.userCardDisplaySetting.configMajorVersion
        ) ?
            props.userCardDisplaySetting :
            props.defaultCardDisplaySetting

    const mapKeyInfo = useCallback(
        (k: K): [K, React.FC<CardProps>][] => {
            const v = props.customizableCardsConfig.customizableCards.get(k)
            return v ? [[k, v]] : []
        }
        , [props.customizableCardsConfig.customizableCards]
    )

    const childrenList = useMemo(
        () => [
            // 设置中设置了要显示的卡片
            ...useSetting
                .show
                .keys()
                .flatMap(mapKeyInfo),
            // 获取到的设置中没有设置要不要显示，
            // 但是实际上默认设置又设置了要显示的卡片。
            // 有可能发生在小程序更新之后
            ...props.defaultCardDisplaySetting.show
                .difference(useSetting.show)
                .difference(useSetting.dontShow)
                .keys()
                .flatMap(mapKeyInfo)
        ],
        [props.defaultCardDisplaySetting.show, mapKeyInfo, useSetting.dontShow, useSetting.show]
    )

    const onAllLoadFinished = props.onAllLoadFinished;
    // 由于usePromise返回的isPending初始值是false
    // 对于使用usePromise的请求而言
    // 第一次渲染会触发onOneFetchStatusChange(false)
    // 后续请求开始执行会触发onOneFetchStatusChange(true)
    // 请求完成后会触发onOneFetchStatusChange(false)
    // 需要设置一定的LoadingCount初始值
    // 需要设置一定的时间防止onFetchDataFinished触发
    const [isFetchDataFinished, onOneFetchStatusChange] =
        useIsLoadingCountZero(childrenList.length);
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

    return <>{childrenList.map(
        ([cardKey, Card]) =>
            <Card
                key={cardKey}
                onLoadingStatusChange={onOneFetchStatusChange}
                reloadController={props.reloadAllController}
            />
    )}</>
};

export default CardListSortablePart;