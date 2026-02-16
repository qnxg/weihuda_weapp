import { Navigator, View } from '@tarojs/components'
import dayjs from 'dayjs'
import React, { useCallback } from 'react'
import MessageItem from '../../components/MessageItem'
import styles from './index.module.scss'
import { getAnnouncement } from '@/apis/announcement'
import { getNoticePageApi } from '@/apis/notice'
import Card from '@/components/Card'
import CardHeader from '@/components/Card/CardHeader'
import Empty from '@/components/Empty'
import icon from '@/static/mine/icon-date.svg'
import usePromise from '@/utils/hooks/usePromise'
import useRefreshKey from '@/utils/hooks/useRefreshKey'

const Index: React.FC = () => {
  const [refreshKey, refreshTrigger] = useRefreshKey()

  const getRecentNotices = useCallback(
    async () => (await getNoticePageApi({ page: 1, pageSize: 20 })).rows,
    []
  )

  const [recentNotices] = usePromise(
    getRecentNotices,
    [],
    [getRecentNotices, refreshKey]
  )
  const [recentAnnouncements] = usePromise(
    getAnnouncement,
    [],
    [getAnnouncement, refreshKey]
  )

  const unreadCount = recentNotices.filter(item => item.status === 0).length

  return (
    <View style={{ paddingBottom: '20px' }}>
      <Card className={styles.countInfo}>
        当前有 {recentAnnouncements.length} 条公告，
        {unreadCount} 条未读的用户消息。
      </Card>
      {recentAnnouncements.map(item => {
        const CardComp = (
          <Card key={`msg-card-${item.id}`}>
            <CardHeader
              title={dayjs(item.createdAt).format('YYYY-MM-DD')}
              icon={icon}
            />
            <View className={styles.content_out}>
              <View className={styles.title}>{item.title}</View>
              <View className={styles.content}>{item.content}</View>
            </View>
          </Card>
        )
        if (item.url) {
          return (
            <Navigator key={`msg-navi-${item.id}`} url={item.url}>
              {CardComp}
            </Navigator>
          )
        }
        return CardComp
      })}
      {recentNotices.map(item => {
        return (
          <Card key={`notice-${item.id}`}>
            <MessageItem
              className={styles.messageItem}
              data={item}
              afterMarkAsRead={refreshTrigger}
            />
          </Card>
        )
      })}
      {recentAnnouncements.length + recentNotices.length == 0 && (
        <Card>
          <Empty>暂无消息</Empty>
        </Card>
      )}
    </View>
  )
}

export default Index
