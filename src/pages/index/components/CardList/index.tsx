import { GradeItem, getGrade } from '@/apis/hdjw/grade'
import { SmesterInfo, getSmesterInfo } from '@/apis/info'
import { Message, getMessage } from '@/apis/back/message'
import { NetflowData, getNetflow } from '@/apis/netflow'
import { CardInfo, getCardInfo } from '@/apis/pt/card'
import { getUnReadCount } from '@/apis/pt/email'
import { useAppSelector } from '@/hooks/redux'
import { Block, View } from '@tarojs/components'
import dayjs from 'dayjs'
import React, { useEffect, useState } from 'react'
import CampusCard from '../CampusCard'
import CountdownCard from '../CountdownCard'
import EmailCard from '../EmailCard'
import GradeCard from '../GradeCard'
import MessageCard from '../MessageCard'
import NetflowCard from '../NetflowCard'
import TodayClass from '../TodayClassCard'
import styles from './index.module.scss'
import { CardListProps } from './interface'

const CardList: React.FC<CardListProps> = (props) => {
  const { curDayAndWeek, runRefereshFlag, stopRefresh } = props
  const { termYear, termType } = useAppSelector((state) => state.smester)
  const [daysLeft, setDaysLeft] = useState(999)

  const [messageData, setMessageData] = useState<Message[] | undefined>(undefined)
  const [smesterDate, setSmesterDate] = useState<SmesterInfo | undefined>(undefined)
  const [gradeData, setGradeData] = useState<GradeItem[] | undefined>(undefined)
  const [netFlowData, setNetFlowData] = useState<NetflowData | undefined>(undefined)
  const [cardData, setCardData] = useState<CardInfo | undefined>(undefined)
  const [unReadCount, setUnReadCount] = useState<number | undefined>(undefined)

  // 获取数据
  const getData = async () => {
    return Promise.allSettled([
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

      // 获取未读邮件数量
      getUnReadCount().then((res) => {
        setUnReadCount(res)
      })
    ])
  }

  useEffect(() => {
    if (runRefereshFlag) {
      getData().then(() => {
        stopRefresh()
      })
    }
  }, [runRefereshFlag])

  // 获取成绩
  useEffect(() => {
    // 获取成绩
    getGrade(termYear, termType).then((res) => {
      setGradeData(res)
    })
  }, [termYear, termType])

  useEffect(() => {
    if (smesterDate) {
      const today = dayjs(dayjs().format('YYYY-MM-DD'))
      // 假期开始时间
      const vacation = dayjs(smesterDate.vacation)
      // 下个学期开始时间
      const termStart = dayjs(smesterDate.next)
      // 今天是否在假期之前
      const isInTerm = today.isBefore(vacation, 'day')
      // 如果假期之前，假期减去今天，否则今天减去下个学期开始时间
      const interval = isInTerm ? vacation.diff(today, 'day') : today.diff(termStart, 'day')
      // 小于0表示正在假期中，大于0表示当前学期还没结束
      setDaysLeft(interval)
    }
  }, [smesterDate])

  return (
    <Block>
      <MessageCard message={messageData || []} />
      <TodayClass currentWeek={curDayAndWeek.curWeek || 0} dayOfTheWeek={curDayAndWeek.curDay || 0} />
      <View className={styles.cardView}>
        <View className={styles.cardItem}>
          <GradeCard grade={gradeData} />
        </View>
        <View className={styles.cardItem}>
          <NetflowCard netFlow={netFlowData} />
        </View>
        {/* 电费卡片
          <View>
            <ElectricityCard electricity={data?.data?.garden?.electricity} dorm={data?.data?.garden?.dorm} />
          </View> */}
        <View className={styles.cardItem}>
          <CountdownCard daysLeft={daysLeft} />
        </View>
        <View className={styles.cardItem}>
          <CampusCard info={cardData} />
        </View>
        <View className={styles.cardItem}>
          <EmailCard unReadCount={unReadCount} />
        </View>
      </View>
    </Block>
  )
}

export default CardList
