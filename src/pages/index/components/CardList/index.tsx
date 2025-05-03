import { useAppDispatch } from '@/hooks/redux'
import { fetchNoticeThunk } from '@/models/notice'
import { Block } from '@tarojs/components'
import React, { useEffect } from 'react'
import { CardListProps } from './interface'
import CardListSortablePart from './CardListSortablePart'
import { customizableCardsConfig, defaultCardSetting } from './index.config'

const CardList: React.FC<CardListProps> = (
  { fetchDataControl, onFetchDataFinished }
) => {

  const dispatch = useAppDispatch()
  // notice?
  // 暂时不跟踪loading状态
  useEffect(() => {
    (async () => {
      try {
        await dispatch(fetchNoticeThunk())
      } finally {
        //
      }
    })()
  }, [dispatch, fetchDataControl])

  return (
    <Block>
      <CardListSortablePart
        customizableCardsConfig={customizableCardsConfig}
        userCardDisplaySetting={defaultCardSetting}
        defaultCardDisplaySetting={defaultCardSetting}
        onAllLoadFinished={onFetchDataFinished}
        reloadAllController={fetchDataControl} />
    </Block>
  )
}

export default CardList
