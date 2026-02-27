import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useLoadingCounter } from './CardProps'
import type CardProps from './CardProps'

const ConfigurableCardList = <K extends React.Key>(props: {
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
   * 忽略所有不存在于可配置列表的卡片名称
   */
  const mapKeyInfo = useCallback(
    (k: K): [K, React.FC<CardProps>][] => {
      const v = props.customizableCards.get(k)
      return v ? [[k, v]] : []
    },
    [props.customizableCards]
  )

  const childrenList = useMemo(
    () => [
      // 置顶的，用户无法设置的卡片
      ...props.topCards,
      // 要显示的卡片
      ...props.CardsToShow.keys().flatMap(mapKeyInfo),
    ],
    [props.topCards, props.CardsToShow, mapKeyInfo]
  )

  const onAllLoadFinished = props.onAllLoadFinished
  // 由于第一次渲染时loadingCount可能暂时会减到0
  // 需要设置一定的时间防止onFetchDataFinished触发
  const [loadingCount, onOneFetchStatusChange] = useLoadingCounter()
  const [enableOnFetchDataFinished, setEnableOnFetchDataFinished] =
    useState(false)
  useEffect(() => {
    setEnableOnFetchDataFinished(false)
    // 500ms内不会认为请求完成
    setTimeout(() => setEnableOnFetchDataFinished(true), 500)
  }, [props.reloadAllController])
  useEffect(() => {
    if (loadingCount === 0 && enableOnFetchDataFinished) {
      onAllLoadFinished()
    }
  }, [loadingCount, enableOnFetchDataFinished, onAllLoadFinished])

  return (
    <>
      {childrenList.map(([cardKey, Card]) => (
        <Card
          key={cardKey}
          onLoadingStatusChange={onOneFetchStatusChange(cardKey)}
          reloadController={props.reloadAllController}
        />
      ))}
    </>
  )
}

export default ConfigurableCardList
