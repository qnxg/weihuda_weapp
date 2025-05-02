import { Message, getMessage } from '@/apis/back/message'
import { Dormitory, getDormitoryApi, getElectricityApi } from '@/apis/electricity'
import { GradeItem, getGrade } from '@/apis/hdjw/grade'
import { SmesterInfo, getSmesterInfo } from '@/apis/info'
import { getNetflow } from '@/apis/netflow'
import { CardInfo, getCardInfo } from '@/apis/pt/card'
import { getUnReadCount } from '@/apis/pt/email'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { fetchNoticeThunk } from '@/models/notice'
import ElectricityCard from '@/pages/index/components/ElectricityCard'
import { Block, View } from '@tarojs/components'
import dayjs from 'dayjs'
import React, { useCallback, useEffect, useState } from 'react'
import usePromise from '@/utils/usePromise'
import CampusCard from '../CampusCard'
import CountdownCard from '../CountdownCard'
import EmailCard from '../EmailCard'
import GradeCard from '../GradeCard'
import MessageCard from '../MessageCard'
import NetflowCard from '../NetflowCard'
import HomeSwiperCard from '../SwiperCard'
import TodayClassCard from '../TodayClassCard'
import styles from './index.module.scss'
import { CardListProps } from './interface'
import CardListSort from './CardListSortablePart'
import CardProps, { useIsLoadingCountZero } from '../CardProps'

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

const NewMessageCard: React.FC<CardProps> = ({ onLoadingStatusChange, reloadController }) => {
  const [messageData, isMessageDataLoading] =
    usePromise(getMessage, undefined, [reloadController]);
  useEffect(() => {
    onLoadingStatusChange(isMessageDataLoading)
  }, [isMessageDataLoading, onLoadingStatusChange])
  return <MessageCard message={messageData || []} />
}

const NewGradeCard: React.FC<CardProps> = ({ onLoadingStatusChange, reloadController }) => {
  const { termYear, termType } = useAppSelector((state) => state.smester)
  const [gradeData, setGradeData] = useState<undefined | GradeItem[]>(undefined);
  useEffect(() => {
    onLoadingStatusChange(false)
  }, [onLoadingStatusChange])
  useEffect(() => {
    (async () => {
      // 初始的termType为null的时候不用去获取数据，所以需要跳过第一次获取
      if (!termType) return;
      onLoadingStatusChange(true)
      try {
        setGradeData(await getGrade(termYear, termType))
      } finally {
        onLoadingStatusChange(false)
      }
    })()
  }, [termType, termYear, onLoadingStatusChange, reloadController])
  return <GradeCard grade={gradeData} />
}

const NewCountdownCard: React.FC<CardProps> = ({ onLoadingStatusChange, reloadController }) => {
  const [semesterDate, isSemesterDateLoading] =
    usePromise(getSmesterInfo, undefined, [reloadController])
  useEffect(() => {
    onLoadingStatusChange(isSemesterDateLoading)
  }, [isSemesterDateLoading, onLoadingStatusChange])
  return <CountdownCard daysLeft={computeDaysLeft(semesterDate)} />
}

const NewNetflowCard: React.FC<CardProps> = ({ onLoadingStatusChange, reloadController }) => {
  const [netflowData, isNetflowDataLoading] =
    usePromise(getNetflow, undefined, [reloadController])
  useEffect(() => {
    onLoadingStatusChange(isNetflowDataLoading)
  }, [isNetflowDataLoading, onLoadingStatusChange])
  return <NetflowCard netFlow={netflowData} />
}

const NewCampusCard: React.FC<CardProps> = ({ onLoadingStatusChange, reloadController }) => {
  const [cardData, isCardDataLoading] =
    usePromise(getCardInfo, undefined, [reloadController]);
  useEffect(() => {
    onLoadingStatusChange(isCardDataLoading)
  }, [isCardDataLoading, onLoadingStatusChange])
  return <CampusCard info={cardData} />
}

const NewEmailCard: React.FC<CardProps> = ({ onLoadingStatusChange, reloadController }) => {
  const [unReadCount, isUnReadCountLoading] =
    usePromise(getUnReadCount, undefined, [reloadController])
  useEffect(() => {
    onLoadingStatusChange(isUnReadCountLoading)
  }, [isUnReadCountLoading, onLoadingStatusChange])
  return <EmailCard unReadCount={unReadCount} />
}

const NewElectricityCard: React.FC<CardProps> = ({ onLoadingStatusChange, reloadController }) => {
  const getElectricityCardInfo = useCallback(async () => ({
    electricity: await getElectricityApi(),
    dormitory: (await getDormitoryApi())?.room ?? "未知",
  }), [])
  const [cardInfo, isCardInfoLoading] =
    usePromise(
      getElectricityCardInfo,
      {
        electricity: "查询失败",
        dormitory: "未知"
      }, [reloadController])
  useEffect(
    () => {
      onLoadingStatusChange(isCardInfoLoading)
    },
    [isCardInfoLoading, onLoadingStatusChange]
  )
  return <ElectricityCard
    electricity={cardInfo.electricity}
    dormitory={cardInfo.dormitory} />
}

/** 这个卡片无法刷新？ */
const NewTodayClassCard: React.FC<CardProps> = ({ onLoadingStatusChange }) => {
  useEffect(() => {
    onLoadingStatusChange(false)
  }, [onLoadingStatusChange])

  const { dayOfWeek } = useAppSelector((state) => state.smester)
  const { currentWeek } = useAppSelector((state) => state.classTable)

  return <TodayClassCard
    currentWeek={currentWeek || 0}
    dayOfTheWeek={dayOfWeek || 0} />
}

const CardList: React.FC<CardListProps> = (
  { fetchDataControl, onFetchDataFinished }
) => {

  const dispatch = useAppDispatch()
  // notice?
  // 暂时不跟踪loading状态
  useEffect(() => {
    (async () => {
      try {
        await dispatch(fetchNoticeThunk())
      } finally {
        //
      }
    })()
  }, [dispatch, fetchDataControl])

  const childrenList = [
    NewMessageCard,
    HomeSwiperCard,
    NewTodayClassCard,
    NewNetflowCard,
    NewElectricityCard,
    NewCountdownCard,
    NewCampusCard,
    NewEmailCard,
    NewGradeCard,
  ];

  return (
    <Block>
      <CardListSort
        childrenList={childrenList}
        onAllLoadFinished={onFetchDataFinished}
        reloadAllController={fetchDataControl} />
    </Block>
  )
}

export default CardList
