import { View } from '@tarojs/components'
import dayjs from 'dayjs'
import React, { useEffect, useMemo } from 'react'

import CardLayout from '../utils/CardLayout'
import styles from './index.module.scss'
import { getSemesterInfo } from '@/apis/info'
import icon from '@/static/index/icon/days-left.svg'
import usePromise from '@/utils/hooks/usePromise'
import type CardProps from '../../CardProps'
import type { CurrentSemesterInfo } from '@/apis/info'

interface Props {
  daysLeft: number
}

const CountdownCardDisplay: React.FC<Props> = ({ daysLeft }) => {
  const dataList = useMemo(() => {
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
  return (
    <CardLayout
      icon={icon}
      title={daysLeft > 0 ? '假期倒计时' : '开学倒计时'}
      url='/queryPage/schoolCalendar/index'
    >
      <View className={styles.outer}>
        <View>距离{daysLeft > 0 ? '本学期' : '假期'}结束还有</View>
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
  if (!semesterDate) {
    return 999
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
  const [semesterDate, isSemesterDateLoading] = usePromise(
    getSemesterInfo,
    undefined,
    [getSemesterInfo, reloadController]
  )
  useEffect(() => {
    onLoadingStatusChange(isSemesterDateLoading)
  }, [isSemesterDateLoading, onLoadingStatusChange])
  return <CountdownCardDisplay daysLeft={computeDaysLeft(semesterDate)} />
}

export default CountdownCard
