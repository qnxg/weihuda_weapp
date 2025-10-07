import { Navigator, View } from '@tarojs/components'
import React from 'react'
import MessageItem from '../../components/MessageItem'
import styles from './index.module.scss'
import { getMessage } from '@/apis/message'
import { getRecentNotices } from '@/apis/notice'
import Card from '@/components/Card'
import CardHeader from '@/components/Card/CardHeader'
import Empty from '@/components/Empty'
import icon from '@/static/mine/icon-date.svg'
import usePromise from '@/utils/hooks/usePromise'
import useRefreshKey from '@/utils/hooks/useRefreshKey'

const Index: React.FC = () => {

  const [refreshKey, refreshTrigger] = useRefreshKey()

  const [recentNotices] = usePromise(getRecentNotices, [], [getRecentNotices, refreshKey]);
  const [recentMessages] = usePromise(getMessage, [], [getMessage, refreshKey])

  const unreadCount = recentNotices.filter(item => item.status === 0).length

  return (
    <View style={{ paddingBottom: '20px' }}>
      <Card className={styles.countInfo}>
        当前有 {recentMessages.length} 条公告，
        {unreadCount} 条未读的用户消息。
      </Card>
      {recentMessages.map((item, i) => {
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
      {recentNotices.map((item, i) => {
        return (
          <Card key={`notice-card-${i}`}>
            <MessageItem
              className={styles.messageItem}
              data={item}
              afterMarkAsRead={refreshTrigger}
            />
          </Card>
        )
      })}
      {recentMessages.length + recentNotices.length == 0 && (
        <Card>
          <Empty>暂无消息</Empty>
        </Card>
      )}
    </View>
  )
}

export default Index
