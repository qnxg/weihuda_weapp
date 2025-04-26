import PullRefresh, { RefProps } from '@/components/PullRefresh'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { initClassTableThunk, refreshClassTableThunk } from '@/models/classTable'
import { getSmesterInfoThunk } from '@/models/smester'
import { getUserInfoThunk } from '@/models/userInfo'
import { View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import React, { Fragment, useEffect, useRef, useState } from 'react'
import CardList from './components/CardList'
import DateBar from './components/DateBar'
import styles from './index.module.scss'
import useRefreshKey from '@/utils/useRefreshKey'

const Index: React.FC = () => {
  const [fetchDataListener, fetchDataTrigger] = useRefreshKey();
  const { dayOfWeek } = useAppSelector((state) => state.smester)
  const { isBind } = useAppSelector((state) => state.userInfo)
  const { currentWeek, semesters: terms } = useAppSelector((state) => state.classTable)

  const dispatch = useAppDispatch()

  /** 拉取基本信息 */
  useEffect(() => {
    dispatch(getUserInfoThunk())
    dispatch(getSmesterInfoThunk()).then(() => {
      dispatch(initClassTableThunk())
    })
  }, [dispatch])

  useEffect(() => {
    if (isBind) {
      if (terms && terms.length > 0) {
        dispatch(refreshClassTableThunk())
      } else {
        dispatch(initClassTableThunk())
      }
    }
  }, [isBind, terms, dispatch])

  useEffect(() => {
    if (currentWeek !== undefined && currentWeek !== null) {
      Taro.setNavigationBarTitle({
        title: currentWeek >= 0 ? `第${currentWeek}周` : `距开学${-currentWeek}周`
      })
    }
  }, [currentWeek])

  const scrollRef = useRef<RefProps | null>(null)

  return (
    <Fragment>
      <DateBar />
      <PullRefresh ref={scrollRef} topGap={100} runFunc={fetchDataTrigger}>
        <View className={styles.contentOuter}>
          <CardList
            onFetchDataFinished={() => {
              scrollRef.current?.stop()
            }}
            fetchDataListener={fetchDataListener}
            curDayAndWeek={{ curWeek: currentWeek, curDay: dayOfWeek }}
          />
        </View>
      </PullRefresh>
    </Fragment>
  )
}

export default Index
