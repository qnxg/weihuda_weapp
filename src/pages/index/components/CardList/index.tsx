import { Block, Text, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import React, { Key, useEffect } from 'react'

import ConfigurableCardList from './ConfigurableCardList'
import { customizableCardsMap, topCards } from './index.config'

import style from './index.module.scss'
import Card from '@/components/Card'
import { fetchNoticeThunk } from '@/models/notice'
import { useAppDispatch } from '@/utils/hooks/redux'
import { useFinalCardDisplay } from "@/utils/storage/userSettings/customAccessors/computeFinalCardDisplay"

/** 跳转首页卡片设置的卡片 */
const GoToCardSettings: React.FC = () =>
  <View className={style.goToCardSettingsCard}>
    <Card onClick={() => {
      void Taro.navigateTo({ url: '/settingsPage/indexCardSettings/index' })
    }}>
      <View className={style.goToCardSettingsContainer}>
        <Text className={style.goToCardSettingsText}>
          设置卡片…
        </Text>
      </View>
    </Card>
  </View>

export interface CardListProps {
  /** 如果变化则重新获取首页数据 */
  fetchDataControl: Key
  onFetchDataFinished: any
}

const CardList: React.FC<CardListProps> = (
  { fetchDataControl, onFetchDataFinished }
) => {

  const dispatch = useAppDispatch()
  // notice?
  // 暂时不跟踪loading状态
  useEffect(() => {
    void (async () => {
      await dispatch(fetchNoticeThunk())
    })()
  }, [dispatch, fetchDataControl])

  const [cardsToShow] = useFinalCardDisplay([fetchDataControl])

  return (
    <Block>
      <ConfigurableCardList
        // key的设置是重要的：见ConfigurableCardList的描述
        key={fetchDataControl + Array.from(cardsToShow).join(' ')}
        topCards={topCards}
        customizableCards={customizableCardsMap}
        CardsToShow={cardsToShow}
        onAllLoadFinished={onFetchDataFinished}
        reloadAllController={fetchDataControl} />
      <GoToCardSettings />
    </Block>
  )
}

export default CardList