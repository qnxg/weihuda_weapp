import { View } from '@tarojs/components'
import React from 'react'

import styles from './index.module.scss'

interface Grade {
  name: string
  score: number
  content: string
}

interface Props {
  grade: Grade
}

const GradeBanner: React.FC<Props> = ({ grade }) => {
  const { name = 'null', score = 0, content } = grade
  return (
    <View className={styles.outer}>
      <View className={styles.subject}>{name}</View>
      <View className={styles.banner}>
        <View
          className={styles.percent}
          style={{
            width: `${score}%`,
            borderRadius: score > 7.5 ? '24rpx' : '24rpx 0 0 24rpx',
          }}
        />
      </View>
      <View className={styles.score}>{content}</View>
    </View>
  )
}

export default GradeBanner
