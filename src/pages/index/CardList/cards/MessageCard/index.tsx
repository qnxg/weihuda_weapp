import { Swiper, SwiperItem, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import React, { useEffect, useMemo, useState } from 'react'
import MessageItem from '../../../../../components/MessageItem'
import styles from './index.module.scss'
import { getMessage } from '@/apis/message'
import { getRecentNotices, type INotice } from '@/apis/notice'
import Card from '@/components/Card'
import CardHeader from '@/components/Card/CardHeader'
import icon from '@/static/index/icon/message.svg'
import usePromise from '@/utils/hooks/usePromise'
import useShowCount from '@/utils/hooks/useShowCount'
import { getBoundingClientRect } from '@/utils/tool'
import type CardProps from '../../CardProps'
import type { Message } from '@/apis/message'
import type { BaseEventOrig, SwiperProps } from '@tarojs/components'

interface IProps {
  noticeToShow: INotice[]
  message: Message[]
}

const MessageCardDisplay: React.FC<IProps> = ({ message, noticeToShow }) => {
  // 当前显示的消息
  const [current, setCurrent] = useState(0)
  // 高度，用于swiper的高度
  const [height, setHeight] = useState(0)

  // 计算后的高度
  const calcedHeights = useMemo(async () => {
    const rects = await getBoundingClientRect(`.${styles.messageItem}`)
    if (!rects || rects.length === 0) return [120]
    setHeight(rects[0]!.height)
    return rects.map(item => {
      if (item) return item.height
      return 120
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noticeToShow, message])

  // 滑块切换
  const handleSwiperChange = (
    e: BaseEventOrig<SwiperProps.onChangeEventDetail>
  ) => {
    setCurrent(e.detail.current)
    void calcedHeights.then(res => {
      setHeight(res[e.detail.current]!)
    })
  }

  const totalCount = message.length + noticeToShow.length

  return (
    <View>
      {totalCount > 0 && (
        <Card>
          <CardHeader
            title={`消息盒子(${totalCount})`}
            footer={
              <View
                onClick={() => {
                  void Taro.navigateTo({
                    url: '/pages/messageBox/index',
                  })
                }}
              >
                查看更多
              </View>
            }
            icon={icon}
          />
          <Swiper
            circular
            duration={500}
            interval={5000}
            current={current}
            autoplay
            easingFunction='easeInOutCubic'
            onChange={handleSwiperChange}
            adjustHeight='current'
            style={{ height: height + 'px' }}
            className={styles.swiper}
          >
            {/* 消息通知 */}
            {noticeToShow.map(item => (
              <SwiperItem key={`notice-${item.id}`}>
                <MessageItem className={styles.messageItem} data={item} />
              </SwiperItem>
            ))}
            {/* 公告 */}
            {message.map(item => {
              return (
                <SwiperItem
                  key={`message-${item.id}`}
                  onClick={() => {
                    void Taro.navigateTo({
                      url: item.url ? item.url : '/pages/messageBox/index',
                    })
                  }}
                >
                  <View className={styles.messageItem}>
                    <View className={styles.title}>{item.title}</View>
                    <View className={styles.content}>{item.content}</View>
                  </View>
                </SwiperItem>
              )
            })}
          </Swiper>
        </Card>
      )}
    </View>
  )
}

const getNoticeToShow = async () =>
  (await getRecentNotices()).filter(
    item => item.status !== 1 && item.isShow !== 0
  )

const MessageCard: React.FC<CardProps> = ({
  onLoadingStatusChange,
  reloadController,
}) => {
  // 在用户返回首页时也重新加载
  const pageShowCnt = useShowCount()

  const [messageData, isMessageDataLoading] = usePromise(
    getMessage,
    [],
    [getMessage, reloadController, pageShowCnt]
  )

  const [noticeToShow, isLoadingNoticeToShow] = usePromise(
    getNoticeToShow,
    [],
    [getNoticeToShow, reloadController, pageShowCnt]
  )

  const combinedLoadingState = isMessageDataLoading || isLoadingNoticeToShow

  useEffect(() => {
    onLoadingStatusChange(combinedLoadingState)
  }, [combinedLoadingState, onLoadingStatusChange])

  return (
    <MessageCardDisplay message={messageData} noticeToShow={noticeToShow} />
  )
}

export default MessageCard
