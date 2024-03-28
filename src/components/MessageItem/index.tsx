import { IBtnConfigItem, INotice } from '@/apis/notice'
import Button from '@/components/Button'
import { useAppDispatch } from '@/hooks/redux'
import { putNoticeByIdThunk } from '@/models/notice'
import { View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classNames from 'classnames'
import dayjs from 'dayjs'
import React, { useState } from 'react'
import styles from './index.module.scss'

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

const MessageItem: React.FC<IMessageItemProps> = ({ data: propsData, className, afterMarkAsRead }) => {
  const [data, setData] = useState<INotice>(propsData)
  const dispatch = useAppDispatch()

  // 如果有回调，则调用回调
  const handleAfterMarkAsRead = (id: number) => {
    if (afterMarkAsRead) {
      setTimeout(() => {
        afterMarkAsRead(id)
      }, 1000)
    }
  }

  // 标记为已读
  const markAsRead = async (id: number) => {
    dispatch(
      putNoticeByIdThunk({
        id,
        status: 1
      })
    )
    setData({
      ...data,
      status: 1
    })
  }

  // 当按钮点击时
  const onBtnClick = async (id: number, type: IBtnConfigItem['type'], value: IBtnConfigItem['value']) => {
    if (type === 'link') {
      // 跳转到链接
      Taro.navigateTo({
        url: value!
      })
    } else if (type === 'button' && value !== undefined) {
      // 更新数据
      dispatch(
        putNoticeByIdThunk({
          id,
          status: 1,
          result: value
        })
      )
      handleAfterMarkAsRead(id)
      setData({
        ...data,
        status: 1,
        result: value!
      })
    }
  }

  // 获取按钮
  const getBtn = (id: number, btnConfigItem: IBtnConfigItem) => {
    if (!btnConfigItem || data.result) return null
    let { text, theme, type, value } = btnConfigItem
    // 如果text为空，则不显示按钮
    if (!text || text.trim() === '') return null
    // 如果theme为空，则默认为primary
    if (!theme) theme = 'primary'
    // 如果type为空，则默认为button
    if (!type) type = 'button'

    const ResultButton = (
      <Button className={styles.btn} theme={theme} onClick={() => onBtnClick(id, type, value)}>
        {text}
      </Button>
    )

    if (btnConfigItem.type === 'button') {
      return ResultButton
    }

    return ResultButton
  }

  return (
    <View className={classNames(styles.messageItem, className)}>
      <View className={styles.content}>{data.content}</View>
      <View className={styles.btnWrapper}>
        <View className={styles.left}>
          <View className={classNames(styles.sendTime, styles.btn)}>{dayjs(data.sendTime).format('YYYY-MM-DD')}</View>
          <View className={classNames(styles.status, styles.btn)}>{data.status === 0 ? '未读' : '已读'}</View>
        </View>
        <View className={styles.right}>
          {data.status === 0 && (
            <Button className={styles.btn} theme='plain' onClick={() => markAsRead(data.id)}>
              标记为已读
            </Button>
          )}
          {data.btnConfig &&
            data.btnConfig.length > 0 &&
            (data.btnConfig as IBtnConfigItem[]).map((btnConfigItem) => {
              return getBtn(data.id, btnConfigItem)
            })}
          {data.result && <View className={classNames(styles.result, styles.btn)}>{data.result}</View>}
        </View>
      </View>
    </View>
  )
}

export default MessageItem
