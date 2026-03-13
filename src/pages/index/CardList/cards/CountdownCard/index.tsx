import { View } from '@tarojs/components'
import dayjs from 'dayjs'
import React, { useEffect, useMemo } from 'react'

import CardLayout from '../utils/CardLayout'
import styles from './index.module.scss'
import { useCurrentSemesterInfo } from '@/apis/semester'
import icon from '@/static/index/icon/days-left.svg'
import type CardProps from '../../CardProps'
import type { CurrentSemesterInfo } from '@/apis/semester'

interface Props {
  daysLeft: number | undefined
}

const CountdownCardDisplay: React.FC<Props> = ({ daysLeft }) => {
  const dataList = useMemo(() => {
    if (daysLeft === undefined) {
      return ['?', '?', '?']
    }
    const temp = Math.abs(daysLeft || 0)
      .toString()
      .split('')
    const result = ['0', '0', '0']
    result.splice(
      3 - temp.length < 0 ? 0 : 3 - temp.length,
      temp.length,
      ...temp
    )
    return result
  }, [daysLeft])

  const isInSem = daysLeft !== undefined && daysLeft > 0

  return (
    <CardLayout
      icon={icon}
      title={isInSem ? '假期倒计时' : '开学倒计时'}
      url='/queryPage/schoolCalendar/index'
    >
      <View className={styles.outer}>
        <View>距离{isInSem ? '本学期' : '假期'}结束还有</View>
        <View className={styles.numArray}>
          {dataList.map((item, index) => {
            return (
              <View key={1000 - index} className={styles.num}>
                {item}
              </View>
            )
          })}
        </View>
        <View>天</View>
      </View>
    </CardLayout>
  )
}

function computeDaysLeft(semesterDate: CurrentSemesterInfo | undefined) {
  if (semesterDate === undefined) {
    return undefined
  }
  const today = dayjs(dayjs().format('YYYY-MM-DD'))
  // 假期开始时间
  const vacation = dayjs(semesterDate.vacation)
  // 下个学期开始时间
  const termStart = dayjs(semesterDate.next)
  // 今天是否在假期之前
  const isInTerm = today.isBefore(vacation, 'day')
  // 如果假期之前，假期减去今天，否则今天减去下个学期开始时间
  const interval = isInTerm
    ? vacation.diff(today, 'day')
    : today.diff(termStart, 'day')
  // 小于0表示正在假期中，大于0表示当前学期还没结束
  return interval
}
const CountdownCard: React.FC<CardProps> = ({
  onLoadingStatusChange,
  reloadController,
}) => {
  const [semesterInfo, loadingFetch] = useCurrentSemesterInfo([
    reloadController,
  ])
  const combinedLoadingStatus = loadingFetch
  useEffect(() => {
    onLoadingStatusChange(combinedLoadingStatus)
  }, [combinedLoadingStatus, onLoadingStatusChange])
  return <CountdownCardDisplay daysLeft={computeDaysLeft(semesterInfo)} />
}

export default CountdownCard
