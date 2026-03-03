import { View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import React, { Fragment, memo, useCallback, useEffect, useRef } from 'react'
import CardList from './CardList'
import DateBar from './DateBar'
import styles from './index.module.scss'
import { useCurrentSemesterInfo } from '@/apis/semester'
import PullRefresh from '@/components/PullRefresh'
import { rawWeekNum } from '@/utils/day'
import useRefreshKey from '@/utils/hooks/useRefreshKey'
import type { RefProps } from '@/components/PullRefresh'

const CardListMemo = memo(CardList)

const Index: React.FC = () => {
  const [fetchDataControl, fetchDataTrigger] = useRefreshKey()

  const [semInfo] = useCurrentSemesterInfo([fetchDataControl])

  useEffect(() => {
    const currentWeek = semInfo
      ? Math.min(18, rawWeekNum(semInfo.startDate) + 1)
      : undefined
    if (currentWeek !== undefined) {
      void Taro.setNavigationBarTitle({
        title: `第${currentWeek}周`,
      })
    }
  }, [semInfo])

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
