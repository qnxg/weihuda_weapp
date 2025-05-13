import { Navigator, View } from '@tarojs/components'
import React, { useCallback, useEffect, useState } from 'react'
import MessageItem from '../../components/MessageItem'
import styles from './index.module.scss'
import { Message, getMessage } from '@/apis/message'
import Card from '@/components/Card'
import CardHeader from '@/components/Card/CardHeader'
import Empty from '@/components/Empty'
import { fetchNoticeThunk } from '@/models/notice'
import icon from '@/static/mine/icon-date.svg'
import { useAppDispatch, useAppSelector } from '@/utils/hooks/redux'

const Index: React.FC = () => {
  // 公告数据
  const [messageData, setMessageData] = useState<Message[]>([])
  // 总消息数
  const [countInfo, setCountInfo] = useState({ total: 0, unread: 0, message: 0 })
  // 消息通知
  const notice = useAppSelector((state) => state.notice)
  // dispatch
  const dispatch = useAppDispatch()

  /**
   * 获取公告数据
   */
  const getMessageData = async () => {
    const res = await getMessage()
    if (res) {
      setMessageData(res)
      return
    }
  }

  // 更新数量
  useEffect(() => {
    setCountInfo({
      total: messageData.length + notice.total,
      message: messageData.length,
      unread: notice.unread
    })
  }, [countInfo, messageData, notice])

  /**
   * 获取消息通知
   */
  const getNotice = useCallback(async () => {
    if (notice.data.length) return
    void dispatch(fetchNoticeThunk())
  }, [dispatch, notice.data.length])

  useEffect(() => {
    void getMessageData()
  }, [])

  useEffect(() => {
    void getNotice()
  }, [getNotice])

  return (
    <View style={{ paddingBottom: '20px' }}>
      <Card className={styles.countInfo}>
        共有{countInfo.total}条消息，含有 {countInfo.message} 条公告，{countInfo.unread} 条未读消息。
      </Card>
      {messageData &&
        messageData.length !== 0 &&
        messageData.map((item, i) => {
          const CardComp = (
            <Card key={`msg-card-${i}`}>
              <CardHeader title={item.create_at} icon={icon} />
              <View className={styles.content_out}>
                <View className={styles.title}>{item.title}</View>
                <View className={styles.content}>{item.content}</View>
              </View>
            </Card>
          )
          if (item.url) {
            return (
              <Navigator key={`msg-navi-${i}`} url={item.url}>
                {CardComp}
              </Navigator>
            )
          }
          return CardComp
        })}
      {notice &&
        notice.data.length !== 0 &&
        notice.data.map((item, i) => {
          return (
            <Card key={`notice-card-${i}`}>
              <MessageItem className={styles.messageItem} data={item} />
            </Card>
          )
        })}
      {(countInfo.total == 0) && (
        <Card>
          <Empty>暂无消息</Empty>
        </Card>
      )}
    </View>
  )
}

export default Index
