import { useAppDispatch } from '@/utils/hooks/redux'
import { fetchNoticeThunk } from '@/models/notice'
import { Block } from '@tarojs/components'
import storage from '@/utils/storage'
import usePromise from '@/utils/hooks/usePromise'
import React, { useCallback, useEffect, useMemo } from 'react'

import { CardListProps } from './interface'
import ConfigurableCardList, { userCardDisplaySettingDeserializer } from './ConfigurableCardList'
import { customizableCardsConfig, defaultCardSetting, topCards } from './index.config'

/** 获取首页卡片顺序设置 */
function useUserCardListSetting(deps: React.DependencyList) {
  const settingFromStorage =
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useMemo(() => userCardDisplaySettingDeserializer(storage.getCardOrder()), deps)
  const getUsableConfig = useCallback(async () => {
    // 如果本地有设置就使用本地设置
    if (settingFromStorage) { return settingFromStorage; }
    // TODO: 本地没有设置时从后端请求设置
    // await ...
    // 如果后端也没有设置，那么就用默认设置
    return defaultCardSetting
  }, [settingFromStorage])
  const [usableSetting] =
    usePromise(
      getUsableConfig,
      settingFromStorage ?? defaultCardSetting,
      [settingFromStorage]
    )
  return usableSetting
}

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

  const cardListSetting = useUserCardListSetting([fetchDataControl]);

  return (
    <Block>
      <ConfigurableCardList
        topCards={topCards}
        customizableCardsConfig={customizableCardsConfig}
        userCardDisplaySetting={cardListSetting}
        defaultCardDisplaySetting={defaultCardSetting}
        onAllLoadFinished={onFetchDataFinished}
        reloadAllController={fetchDataControl} />
    </Block>
  )
}

export default CardList
