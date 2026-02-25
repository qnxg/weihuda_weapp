import { View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classNames from 'classnames'
import dayjs from 'dayjs'
import React, { useState } from 'react'
import styles from './index.module.scss'
import { putNoticeByIdApi, type INotice } from '@/apis/notice'
import Button from '@/components/Button'

interface IMessageItemProps {
  /**
   * 消息通知数据
   */
  data: INotice
  /**
   * 已读按钮点击之后的回调
   */
  afterMarkAsRead?: (id: number) => void
  /**
   * 自定义类名
   */
  className?: string
}

const MessageItem: React.FC<IMessageItemProps> = ({
  data: propsData,
  className,
  afterMarkAsRead,
}) => {
  const [data, setData] = useState<INotice>(propsData)

  // 如果有回调，则调用回调
  const handleAfterMarkAsRead = (id: number) => {
    if (afterMarkAsRead) {
      afterMarkAsRead(id)
    }
  }

  // 标记为已读
  const markAsRead = async (id: number) => {
    await putNoticeByIdApi(id, 1)
    setData({
      ...data,
      status: 1,
    })
    handleAfterMarkAsRead(id)
  }

  return (
    <View className={classNames(styles.messageItem, className)}>
      <View
        className={classNames(styles.content, {
          [styles.read]: data.status === 1,
        })}
        onClick={() => {
          void markAsRead(data.id)
          void Taro.navigateTo({
            url: data.url || '/pages/messageBox/index',
          })
        }}
      >
        {data.content}
      </View>
      <View className={styles.btnWrapper}>
        <View className={styles.left}>
          <View className={classNames(styles.sendTime, styles.btn)}>
            {dayjs(data.createdAt).format('YYYY-MM-DD')}
          </View>
          <View className={classNames(styles.status, styles.btn)}>
            {data.status === 0 ? '未读' : '已读'}
          </View>
        </View>
        <View className={styles.right}>
          {data.status === 0 && (
            <Button
              className={styles.btn}
              theme='plain'
              onClick={() => markAsRead(data.id)}
            >
              标记为已读
            </Button>
          )}
        </View>
      </View>
    </View>
  )
}

export default MessageItem
