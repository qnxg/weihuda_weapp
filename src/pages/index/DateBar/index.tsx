import { View } from '@tarojs/components'
import classNames from 'classnames'
import dayjs from 'dayjs'
import React from 'react'

import styles from './index.module.scss'

interface OneDay {
  month: number
  day: number
}

const weekText = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

const getDate = (): [Array<OneDay>, number] => {
  const dates: Array<OneDay> = []
  const now = dayjs()
  const offset = now.day()
  for (let i = 0; i < 7; i++) {
    const temp = now.add(i - offset, 'day')
    dates[i] = {
      month: temp.month() + 1,
      day: temp.date(),
    }
  }
  return [dates, offset]
}

const DateBar: React.FC = () => {
  const [DatesOfCurWeek, currentDay] = getDate()

  return (
    <View className={styles.outer}>
      {DatesOfCurWeek.map((item, index) => {
        const cns = classNames({
          [styles.item]: true,
          [styles.selected]: index === currentDay,
        })
        return (
          <View key={`${item.month}月${item.day}日`} className={cns}>
            <View>{item.day === 1 ? `${item.month}月` : `${item.day}日`}</View>
            <View>{weekText[index]}</View>
          </View>
        )
      })}
    </View>
  )
}

export default DateBar
