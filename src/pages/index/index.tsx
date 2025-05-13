import { View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import React, { Fragment, memo, useCallback, useEffect, useRef } from 'react'
import CardList from './components/CardList'
import DateBar from './components/DateBar'
import styles from './index.module.scss'
import PullRefresh from '@/components/PullRefresh'
import { initClassTableThunk, refreshClassTableThunk } from '@/models/classTable'
import { getSmesterInfoThunk } from '@/models/smester'
import { getUserInfoThunk } from '@/models/userInfo'
import { useAppDispatch, useAppSelector } from '@/utils/hooks/redux'
import useRefreshKey from '@/utils/hooks/useRefreshKey'
import type { RefProps } from '@/components/PullRefresh';

const CardListMemo = memo(CardList);

const Index: React.FC = () => {
  const [fetchDataControl, fetchDataTrigger] = useRefreshKey();
  const { isBind } = useAppSelector((state) => state.userInfo)
  
  const dispatch = useAppDispatch()
  
  /** 拉取基本信息 */
  useEffect(() => {
    void dispatch(getUserInfoThunk())
    void dispatch(getSmesterInfoThunk()).then(() => {
      void dispatch(initClassTableThunk())
    })
  }, [dispatch])
  
  const { currentWeek, semesters: terms } = useAppSelector((state) => state.classTable)
  useEffect(() => {
    if (isBind) {
      if (terms && terms.length > 0) {
        void dispatch(refreshClassTableThunk())
      } else {
        void dispatch(initClassTableThunk())
      }
    }
  }, [isBind, terms, dispatch])
  
  useEffect(() => {
    if (currentWeek !== undefined && currentWeek !== null) {
      void Taro.setNavigationBarTitle({
        title: currentWeek >= 0 ? `第${currentWeek}周` : `距开学${-currentWeek}周`
      })
    }
  }, [currentWeek])

  const scrollRef = useRef<RefProps | null>(null)

  const onFetchDataFinished = useCallback(() => {
    scrollRef.current?.stop()
  }, [])

  return (
    <Fragment>
      <DateBar />
      <PullRefresh ref={scrollRef} topGap={100} runFunc={fetchDataTrigger}>
        <View className={styles.contentOuter}>
          <CardListMemo
            onFetchDataFinished={onFetchDataFinished}
            fetchDataControl={fetchDataControl}
          />
        </View>
      </PullRefresh>
    </Fragment>
  )
}

export default Index
