import { Message, getMessage } from '@/apis/back/message'
import { Dormitory, getDormitoryApi, getElectricityApi } from '@/apis/electricity'
import { GradeItem, getGrade } from '@/apis/hdjw/grade'
import { SmesterInfo, getSmesterInfo } from '@/apis/info'
import { NetflowData, getNetflow } from '@/apis/netflow'
import { CardInfo, getCardInfo } from '@/apis/pt/card'
import { getUnReadCount } from '@/apis/pt/email'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { fetchNoticeThunk } from '@/models/notice'
import ElectricityCard from '@/pages/index/components/ElectricityCard'
import { Block, View } from '@tarojs/components'
import dayjs from 'dayjs'
import React, { useCallback, useEffect, useState } from 'react'
import CampusCard from '../CampusCard'
import CountdownCard from '../CountdownCard'
import EmailCard from '../EmailCard'
import GradeCard from '../GradeCard'
import MessageCard from '../MessageCard'
import NetflowCard from '../NetflowCard'
import HomeSwiper from '../SwiperCard'
import TodayClass from '../TodayClassCard'
import styles from './index.module.scss'
import { CardListProps } from './interface'

const CardList: React.FC<CardListProps> = (
  { curDayAndWeek, fetchDataControl, onFetchDataFinished }
) => {

  const { termYear, termType } = useAppSelector((state) => state.smester)

  const dispatch = useAppDispatch()

  /** 只被`MessageCard`使用，考虑下移 */
  const [messageData, setMessageData] = useState<Message[] | undefined>(undefined)
  /**目前只被daysLeft使用，后续考虑在重构时消灭这个state */
  const [smesterDate, setSmesterDate] = useState<SmesterInfo | undefined>(undefined)

  function computeDaysLeft(semesterDate: SmesterInfo | undefined) {
    if (!semesterDate) { return 999 }
    const today = dayjs(dayjs().format('YYYY-MM-DD'))
    // 假期开始时间
    const vacation = dayjs(semesterDate.vacation)
    // 下个学期开始时间
    const termStart = dayjs(semesterDate.next)
    // 今天是否在假期之前
    const isInTerm = today.isBefore(vacation, 'day')
    // 如果假期之前，假期减去今天，否则今天减去下个学期开始时间
    const interval = isInTerm ? vacation.diff(today, 'day') : today.diff(termStart, 'day')
    // 小于0表示正在假期中，大于0表示当前学期还没结束
    return interval
  }
  /** 目前只被`CountdownCard`使用，考虑下移 */
  const daysLeft = computeDaysLeft(smesterDate);

  /** 下移到GradeCard */
  const [gradeData, setGradeData] = useState<GradeItem[] | undefined>(undefined)
  /** NetflowCard */
  const [netFlowData, setNetFlowData] = useState<NetflowData | undefined>(undefined)
  /** CampusCard */
  const [cardData, setCardData] = useState<CardInfo | undefined>(undefined)
  /** EmailCard */
  const [unReadCount, setUnReadCount] = useState<number | undefined>(undefined)
  /** ElectricityCard */
  const [electricity, setElectricity] = useState<string | undefined>(undefined)
  /** ElectricityCard */
  const [dormitory, setDormitory] = useState<Dormitory | null>(null)

  // 获取数据
  const getData = useCallback(async () => {
    return Promise.allSettled([
      dispatch(fetchNoticeThunk()),

      // 获取消息盒子
      getMessage().then((res) => {
        setMessageData(res)
      }),

      // 获取学期信息
      getSmesterInfo().then((res) => {
        setSmesterDate(res)
      }),

      // 获取流量信息
      getNetflow().then((res) => {
        setNetFlowData(res)
      }),

      // 获取校园卡余额
      getCardInfo().then((res) => {
        setCardData(res)
      }),

      // 获取电量信息
      getElectricityApi().then((res) => {
        setElectricity(res)
      }),

      // 获取宿舍信息
      getDormitoryApi().then((res) => {
        setDormitory(res)
      }),

      // 获取未读邮件数量
      getUnReadCount().then((res) => {
        setUnReadCount(res)
      })
    ])
  }, [dispatch])

  useEffect(() => {
    getData().then(() => {
      onFetchDataFinished()
    })
  }, [getData, fetchDataControl, onFetchDataFinished])

  // 获取成绩
  useEffect(() => {
    // 获取成绩
    // 初始的termType为null的时候不用去获取数据，所以需要跳过第一次获取
    if (termType) {
      getGrade(termYear, termType).then((res) => {
        setGradeData(res)
      })
    }
  }, [termYear, termType])

  return (
    <Block>
      <MessageCard message={messageData || []} />
      <HomeSwiper />
      <TodayClass currentWeek={curDayAndWeek.curWeek || 0} dayOfTheWeek={curDayAndWeek.curDay || 0} />
      {gradeData && gradeData.length > 0 &&
        <View className={styles.cardItem}>
          <GradeCard grade={gradeData} />
        </View>
      }
      <View className={styles.cardItem}>
        <NetflowCard netFlow={netFlowData} />
      </View>
      <View className={styles.cardItem}>
        <ElectricityCard electricity={electricity} dormitory={dormitory?.room} />
      </View>
      <View className={styles.cardItem}>
        <CountdownCard daysLeft={daysLeft} />
      </View>
      <View className={styles.cardItem}>
        <CampusCard info={cardData} />
      </View>
      <View className={styles.cardItem}>
        <EmailCard unReadCount={unReadCount} />
      </View>
      {
        // 如果没有成绩，就在这个位置加一个空的CardList
        (!gradeData || gradeData.length === 0) && (
          <View className={styles.cardItem}>
            <GradeCard grade={[]} />
          </View>
        )
      }
    </Block>
  )
}

export default CardList
