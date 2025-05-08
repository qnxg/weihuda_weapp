import { getMessage, Message } from '@/apis/back/message'
import Card from '@/components/Card'
import CardHeader from '@/components/Card/CardHeader'
import { useAppSelector } from '@/utils/hooks/redux'
import icon from '@/static/index/icon/message.svg'
import { getBoundingClientRect } from '@/utils/tool'
import { Swiper, SwiperItem, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import usePromise from '@/utils/hooks/usePromise'
import React, { useEffect, useMemo, useState } from 'react'
import MessageItem from '../../../../components/MessageItem'
import styles from './index.module.scss'
import CardProps from '../CardProps'

interface IProps {
  message: Message[]
}

const MessageCardDisplay: React.FC<IProps> = ({ message }) => {
  // 消息通知
  const notice = useAppSelector((state) => state.notice)
  // 总数
  const [total, setTotal] = useState(message.length)
  // 当前显示的消息
  const [current, setCurrent] = useState(0)
  // 高度，用于swiper的高度
  const [height, setHeight] = useState(0)


  // 更新总数
  useEffect(() => {
    setTotal(message.length + notice.unread)
  }, [message, notice])


  // 计算后的高度
  const calcedHeights = useMemo(async () => {
    const rects = await getBoundingClientRect(`.${styles.messageItem}`)
    if (!rects || rects.length === 0) return [120]
    setHeight(rects[0].height)
    return rects.map((item) => {
      if (item) return item.height
      return 120
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notice, message])

  // 滑块切换
  const handleSwiperChange = (e) => {
    setCurrent(e.detail.current)
    calcedHeights.then((res) => {
      setHeight(res[e.detail.current])
    })
  }

  return (
    <View>
      {total > 0 && (
        <Card>
          <CardHeader
            title={`消息盒子(${total})`}
            footer={
              <View
                onClick={() => {
                  Taro.navigateTo({ url: '/pages/messageBox/index' })
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
            interval={6000}
            current={current}
            autoplay
            easingFunction='easeInOutCubic'
            onChange={handleSwiperChange}
            adjustHeight='current'
            style={{ height: height + 'px' }}
            className={styles.swiper}
          >
            {/* 公告 */}
            {message.map((item) => {
              return (
                <SwiperItem
                  key={item.title}
                  onClick={() => {
                    Taro.navigateTo({ url: item.url ? item.url : '/pages/messageBox/index' })
                  }}
                >
                  <View className={styles.messageItem}>
                    <View className={styles.title}>{item.title}</View>
                    <View className={styles.content}>{item.content}</View>
                  </View>
                </SwiperItem>
              )
            })}
            {/* 消息通知 */}
            {notice.data.map((item, i) => {
              if (item.status === 1 || item.isShow === 0) return null
              return (
                <SwiperItem key={`notice-${i}`}>
                  <MessageItem className={styles.messageItem} data={item} />
                </SwiperItem>
              )
            })}
          </Swiper>
        </Card>
      )}
    </View>
  )
}

const MessageCard: React.FC<CardProps> = ({ onLoadingStatusChange, reloadController }) => {
  const [messageData, isMessageDataLoading] =
    usePromise(getMessage, undefined, [reloadController]);
  useEffect(() => {
    onLoadingStatusChange(isMessageDataLoading)
  }, [isMessageDataLoading, onLoadingStatusChange])
  return <MessageCardDisplay message={messageData || []} />
}

export default MessageCard
