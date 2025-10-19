import { Image, View } from '@tarojs/components'
import dayjs from 'dayjs'
import React, { useCallback, useEffect, useState } from 'react'
import styles from './index.module.scss'
import { getCurrentSemesterInfoApi, getCurrentXnXq } from '@/apis/semester'
import Tabs from '@/components/Tab'
import usePromise from '@/utils/hooks/usePromise'
import { staticBaseUrl as baseUrl } from '@/utils/url'

const pages = ['秋季', '寒假', '春季', '夏季']
const urls = [
  `${baseUrl}xiaoli/pic0.svg`,
  `${baseUrl}xiaoli/pic1.svg`,
  `${baseUrl}xiaoli/pic2.svg`,
  `${baseUrl}xiaoli/pic3.svg`,
]

const getCurrentXq = async () => (await getCurrentXnXq())[1]

const Index: React.FC = () => {
  const [xq] = usePromise(getCurrentXq, null, [getCurrentXq])

  const defaultTabIndex = useCallback(() => (xq && xq > 1 ? xq : 0), [xq])
  const [tabIndex, setTabIndex] = useState(defaultTabIndex)
  useEffect(() => {
    setTabIndex(defaultTabIndex())
  }, [defaultTabIndex])

  const [currentSemesterInfo] = usePromise(getCurrentSemesterInfoApi, null, [
    getCurrentSemesterInfoApi,
  ])

  useEffect(() => {
    if (xq === 1 && currentSemesterInfo) {
      const today = dayjs()
      const vacationDay = dayjs(currentSemesterInfo.vacation)
      const nextDay = dayjs(currentSemesterInfo.next)
      if (
        (today.isSame(vacationDay, 'day') ||
          today.isAfter(vacationDay, 'day')) &&
        (today.isSame(nextDay, 'day') || today.isBefore(nextDay, 'day'))
      ) {
        setTabIndex(1)
      }
    }
  }, [currentSemesterInfo, xq])

  const onChangeTab = (page: number): void => {
    setTabIndex(page)
  }

  const tabItems = pages.map((page, idx) => ({
    key: idx,
    label: page,
    body: (
      <View className={styles.box}>
        <Image className={styles.pic} src={urls[tabIndex]!} mode='widthFix' />
      </View>
    ),
  }))

  return (
    <View>
      <Tabs current={tabIndex} onChange={onChangeTab} items={tabItems} />
    </View>
  )
}

export default Index
