import { View } from '@tarojs/components'
import React, { useState } from 'react'
import styles from './index.module.scss'
import type { FitnessItem, Total } from '@/apis/pt/fitness'

interface CardProps {
  total: Total
  sex: string
  name: string
  items?: FitnessItem[] | undefined
}

const bgColors = ['#ff7584', '#8f85d9', '#ffc63f', '#74e0d4', '#ff956b', '#48d197', '#74d9ff']
const percent = [20, 15, 10, 10, 20, 10, 15]

const Card: React.FC<CardProps> = (props) => {
  const { total, sex, name, items } = props
  const [nowAt, setNowAt] = useState(7)

  const onChangeNowAt = (e) => {
    setNowAt(e.target.dataset.id)
  }

  const onCloseNowAt = () => {
    setNowAt(7)
  }

  return (
    <View className={styles.container}>
      <View style={{ opacity: nowAt === 7 ? 1 : 0, transition: '0.05s' }}>
        <View className={styles.name}>
          {name} ({sex})
        </View>
        <View className={styles.score}>总得分 : {total.score || '加载中'}</View>
      </View>
      <View className={styles.bnOuter}>
        {nowAt !== 7 && (
          <View className={styles.content}>
            <View className={styles.title} style={{ color: bgColors[nowAt] }}>
              {items && items[nowAt].name}
            </View>
            <View className={styles.percent}>{`占比${percent[nowAt]}% 得分: ${items && items[nowAt].grade}`}</View>
          </View>
        )}
        <View className={styles.banner}>
          {bgColors.map((color, index) => {
            let width = percent[index]
            if (items && items[0] && items[0].grade !== undefined) {
              width = (percent[index] * +items[index].grade) / 100
            }
            return (
              <View
                key={1000 + index}
                onTouchStart={onChangeNowAt}
                onTouchEnd={onCloseNowAt}
                className={styles.onePart}
                style={{
                  backgroundColor: color,
                  width: `${width}%`
                }}
                data-id={index}
              />
            )
          })}
        </View>
      </View>
    </View>
  )
}

export default Card
