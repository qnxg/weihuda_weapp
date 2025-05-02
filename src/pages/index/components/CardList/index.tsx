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
import TodayClass from '../TodayClassCard'
import styles from './index.module.scss'
import { CardListProps } from './interface'
import CardListSortablePart from './CardListSortablePart'
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

const CardList: React.FC<CardListProps> = (
  { curDayAndWeek, fetchDataControl, onFetchDataFinished }
) => {

  const dispatch = useAppDispatch()

  // 由于usePromise返回的isPending初始值是false
  // 对于使用usePromise的请求而言
  // 第一次渲染会触发onOneFetchStatusChange(false)
  // 后续请求开始执行会触发onOneFetchStatusChange(true)
  // 请求完成后会触发onOneFetchStatusChange(false)
  // 需要设置一定的LoadingCount初始值
  // 需要设置一定的时间防止onFetchDataFinished触发
  const [isFetchDataFinished, onOneFetchStatusChange] = useIsLoadingCountZero(9);
  const [enableOnFetchDataFinished, setEnableOnFetchDataFinished] =
    useState(false);
  useEffect(() => {
    setEnableOnFetchDataFinished(false)
    setTimeout(() => setEnableOnFetchDataFinished(true), 500)
  }, [fetchDataControl])
  useEffect(() => {
    if (isFetchDataFinished && enableOnFetchDataFinished) {
      onFetchDataFinished()
    }
  }, [isFetchDataFinished, enableOnFetchDataFinished, onFetchDataFinished]);

  // notice?
  useEffect(() => {
    (async () => {
      onOneFetchStatusChange(true)
      try {
        await dispatch(fetchNoticeThunk())
      } finally {
        onOneFetchStatusChange(false)
      }
    })()
  }, [dispatch, onOneFetchStatusChange, fetchDataControl])

  /** NetflowCard */
  const [netflowData, isNetflowDataLoading] =
    usePromise(getNetflow, undefined, [fetchDataControl])
  useEffect(() => {
    onOneFetchStatusChange(isNetflowDataLoading)
  }, [isNetflowDataLoading, onOneFetchStatusChange])
  /** CampusCard */
  const [cardData, isCardDataLoading] =
    usePromise(getCardInfo, undefined, [fetchDataControl]);
  useEffect(() => {
    onOneFetchStatusChange(isCardDataLoading)
  }, [isCardDataLoading, onOneFetchStatusChange])
  /** EmailCard */
  const [unReadCount, isUnReadCountLoading] =
    usePromise(getUnReadCount, undefined, [fetchDataControl])
  useEffect(() => {
    onOneFetchStatusChange(isUnReadCountLoading)
  }, [isUnReadCountLoading, onOneFetchStatusChange])
  /** ElectricityCard */
  const [electricity, isElectricityLoading] =
    usePromise(getElectricityApi, undefined, [fetchDataControl])
  useEffect(() => {
    onOneFetchStatusChange(isElectricityLoading)
  }, [isElectricityLoading, onOneFetchStatusChange])
  /** ElectricityCard */
  const [dormitory, isDormitoryLoading] =
    usePromise(getDormitoryApi, null, [fetchDataControl])
  useEffect(() => {
    onOneFetchStatusChange(isDormitoryLoading)
  }, [isDormitoryLoading, onOneFetchStatusChange])

  // TODO: use memo
  return (
    <Block>
      <NewMessageCard
        onLoadingStatusChange={onOneFetchStatusChange}
        reloadController={fetchDataControl} />
      <CardListSortablePart>
        <HomeSwiperCard
          onLoadingStatusChange={onOneFetchStatusChange}
          reloadController={fetchDataControl} />
        <TodayClass
          currentWeek={curDayAndWeek.curWeek || 0}
          dayOfTheWeek={curDayAndWeek.curDay || 0} />
        <NetflowCard netFlow={netflowData} />
        <ElectricityCard electricity={electricity} dormitory={dormitory?.room} />
        <NewCountdownCard
          onLoadingStatusChange={onOneFetchStatusChange}
          reloadController={fetchDataControl} />
        <CampusCard info={cardData} />
        <EmailCard unReadCount={unReadCount} />
        <NewGradeCard
          onLoadingStatusChange={onOneFetchStatusChange}
          reloadController={fetchDataControl} />
      </CardListSortablePart>
    </Block>
  )
}

export default CardList
