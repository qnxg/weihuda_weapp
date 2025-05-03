import { useAppDispatch } from '@/hooks/redux'
import { fetchNoticeThunk } from '@/models/notice'
import { Block } from '@tarojs/components'
import React, { useEffect } from 'react'
import { CardListProps } from './interface'
import ConfigurableCardList from './ConfigurableCardList'
import { customizableCardsConfig, defaultCardSetting, topCards } from './index.config'

const CardList: React.FC<CardListProps> = (
  { fetchDataControl, onFetchDataFinished }
) => {

  const dispatch = useAppDispatch()
  // notice?
  // 暂时不跟踪loading状态
  useEffect(() => {
    (async () => {
      await dispatch(fetchNoticeThunk())
    })()
  }, [dispatch, fetchDataControl])

  return (
    <Block>
      <ConfigurableCardList
        topCards={topCards}
        customizableCardsConfig={customizableCardsConfig}
        userCardDisplaySetting={defaultCardSetting}
        defaultCardDisplaySetting={defaultCardSetting}
        onAllLoadFinished={onFetchDataFinished}
        reloadAllController={fetchDataControl} />
    </Block>
  )
}

export default CardList
