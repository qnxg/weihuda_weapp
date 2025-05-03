import React, { useCallback, useEffect, useMemo, useState } from "react";
import CardProps, { useIsLoadingCountZero } from "../CardProps";

export type CustomizableCardsConfig<K extends React.Key> = {
    /** 为了设置的后向兼容，
     * 当该值与取到的`UserCardDisplaySetting`中的值不同时，
     * 用户设置会被忽略，
     * 直到用户重新设置
     */
    configMajorVersion: string;
    /** 首页可以自定义出现与否与顺序的卡片 */
    customizableCards: Map<K, React.FC<CardProps>>
}

export type UserCardDisplaySetting<K extends React.Key> = {
    /** 为了设置的后向兼容，
     * 当该值与取到的`CustomizableCardsConfig`中的值不同时，
     * 用户设置会被忽略，
     * 直到用户重新设置
     */
    configMajorVersion: string
    show: Set<K>
    /** 为了设置的后向兼容，
     * 如果一个卡片既没有在show中也没有在dontShow中，
     * 它就会被添加到页面的末尾显示。
     * 多个这种情况的卡片的排序按照默认设置中的优先级。
     */
    dontShow: Set<K>
};

const ConfigurableCardList = <K extends React.Key,>(props: {
    /** 置顶的卡片 */
    topCards: [K, React.FC<CardProps>][]
    /** 可配置的卡片列表 */
    customizableCardsConfig: CustomizableCardsConfig<K>
    /** 用户的卡片设置 */
    userCardDisplaySetting: UserCardDisplaySetting<K>
    /** 默认的卡片设置 */
    defaultCardDisplaySetting: UserCardDisplaySetting<K>
    /** 在所有卡片（含置顶的和用户设置的）加载完成后触发 */
    onAllLoadFinished: () => unknown
    /** 如果改变，则重新加载所有卡片的数据 */
    reloadAllController: unknown
}) => {

    // 如果主版本不匹配，则完全使用默认设置
    const useSetting =
        (props.customizableCardsConfig.configMajorVersion ==
            props.userCardDisplaySetting.configMajorVersion
        ) ?
            props.userCardDisplaySetting :
            props.defaultCardDisplaySetting

    /**
     * 后向兼容：忽略所有不存在的卡片名称
    */
    const mapKeyInfo = useCallback(
        (k: K): [K, React.FC<CardProps>][] => {
            const v = props.customizableCardsConfig.customizableCards.get(k)
            return v ? [[k, v]] : []
        }
        , [props.customizableCardsConfig.customizableCards]
    )

    const childrenList = useMemo(
        () => [
            // 置顶的，用户无法设置的卡片
            ...props.topCards,
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
        [props.topCards, props.defaultCardDisplaySetting.show,
        useSetting.show, useSetting.dontShow, mapKeyInfo]
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