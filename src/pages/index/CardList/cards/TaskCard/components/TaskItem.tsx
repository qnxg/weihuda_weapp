import { View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classNames from 'classnames'
import React from 'react'
import styles from './TaskItem.module.scss'

interface TaskItemProps {
  // 显示类型
  displayType: 'upcoming' | 'soon' | 'normal'
  // 左侧日期
  date?: string
  // 左侧时间
  time?: string
  // 主标题
  title: string
  // 信息项列表
  infoItems?: string[]
  // 右侧天数文本
  daysText?: string
  // 点击跳转 URL
  navigateUrl?: string
}

const TaskItem: React.FC<TaskItemProps> = ({
  displayType,
  date,
  time,
  title,
  infoItems = [],
  daysText,
  navigateUrl,
}) => {
  const handleClick = () => {
    if (navigateUrl) {
      void Taro.navigateTo({
        url: navigateUrl,
      })
    }
  }

  return (
    <View
      className={classNames(styles.outer, styles[displayType])}
      onClick={handleClick}
    >
      <View className={styles.leftPart}>
        {date && <View className={styles.dateText}>{date}</View>}
        {time && <View className={styles.timeText}>{time}</View>}
      </View>
      <View className={styles.mainPart}>
        <View className={styles.taskName}>{title}</View>
        {infoItems.length > 0 && (
          <View className={styles.taskInfo}>
            {infoItems.map((item, index) => (
              <View key={index} className={styles.infoItem}>
                {item}
              </View>
            ))}
          </View>
        )}
      </View>
      {daysText && (
        <View className={styles.rightPart}>
          <View>{daysText}</View>
        </View>
      )}
    </View>
  )
}

export default TaskItem
