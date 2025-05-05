import Taro from '@tarojs/taro'
import { useAppDispatch } from '@/utils/hooks/redux'
import { fetchNoticeThunk } from '@/models/notice'
import { Block, Text, View } from '@tarojs/components'
import Card from '@/components/Card'
import { computeFinalCardDisplay } from "@/utils/storage/userSettings/customAccessors/computeFinalCardDisplay"
import React, { useEffect, useMemo } from 'react'

import ConfigurableCardList from './ConfigurableCardList'
import { customizableCardsMap, topCards } from './index.config'

import style from './index.module.scss'

/** 跳转首页卡片设置的卡片 */
const GoToCardSettings: React.FC = () =>
  <View className={style.goToCardSettingsCard}>
    <Card onClick={() => {
      Taro.navigateTo({ url: '/settingsPage/indexCardSettings/index' })
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
  fetchDataControl: any
  onFetchDataFinished: any
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

  const [cardsToShow] = useMemo(computeFinalCardDisplay, [fetchDataControl]);

  return (
    <Block>
      <ConfigurableCardList
        key={fetchDataControl
          /* 后续可以考虑在设置完卡片顺序后
             使用Taro.relaunch完全重新加载到首页，
             这样就不用每次刷新都销毁并重新加载一遍组件了。 */}
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