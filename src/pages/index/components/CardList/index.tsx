import { useAppDispatch } from '@/hooks/redux'
import { fetchNoticeThunk } from '@/models/notice'
import { Block } from '@tarojs/components'
import React, { useEffect } from 'react'
import HomeSwiperCard from '../SwiperCard'
import { CardListProps } from './interface'
import CardListSort from './CardListSortablePart'
import MessageCard from '../MessageCard'
import CountdownCard from '../CountdownCard'
import GradeCard from '../GradeCard'
import NetflowCard from '../NetflowCard'
import CampusCard from '../CampusCard'
import EmailCard from '../EmailCard'
import ElectricityCard from '../ElectricityCard'
import TodayClassCard from '../TodayClassCard'

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
    MessageCard,
    HomeSwiperCard,
    TodayClassCard,
    NetflowCard,
    ElectricityCard,
    CountdownCard,
    CampusCard,
    EmailCard,
    GradeCard,
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
