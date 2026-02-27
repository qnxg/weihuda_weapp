import { Block, Text, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import React from 'react'

import ConfigurableCardList from './ConfigurableCardList'
import { customizableCardsMap, topCards } from './index.config'

import style from './index.module.scss'
import Card from '@/components/Card'
import { useFinalCardDisplay } from '@/utils/storage/userSettings/customAccessors/computeFinalCardDisplay'
import type { Key } from 'react'

/** 跳转首页卡片设置的卡片 */
const GoToCardSettings: React.FC = () => (
  <View className={style.goToCardSettingsCard}>
    <Card
      onClick={() => {
        void Taro.navigateTo({
          url: '/settingsPage/indexCardSettings/index',
        })
      }}
    >
      <View className={style.goToCardSettingsContainer}>
        <Text className={style.goToCardSettingsText}>设置卡片…</Text>
      </View>
    </Card>
  </View>
)

export interface CardListProps {
  /** 如果变化则重新获取首页数据 */
  fetchDataControl: Key
  onFetchDataFinished: any
}

const CardList: React.FC<CardListProps> = ({
  fetchDataControl,
  onFetchDataFinished,
}) => {
  const [cardsToShow] = useFinalCardDisplay([fetchDataControl])

  return (
    <Block>
      <ConfigurableCardList
        topCards={topCards}
        customizableCards={customizableCardsMap}
        CardsToShow={cardsToShow}
        onAllLoadFinished={onFetchDataFinished}
        reloadAllController={fetchDataControl}
      />
      <GoToCardSettings />
    </Block>
  )
}

export default CardList
