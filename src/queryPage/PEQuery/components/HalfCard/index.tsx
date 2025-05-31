import { View } from '@tarojs/components'
import classNames from 'classnames'
import React from 'react'
import styles from './index.module.scss'

interface Props {
  name: string
  color: string
  rank: string
  score: string
}

const HalfCard: React.FC<Props> = props => {
  const { name, rank, score, color: temp } = props
  const cx = classNames({
    [styles.subTitle]: true,
    [styles.backGreen]: temp === 'green',
    [styles.backRed]: temp === 'red',
  })
  return (
    <View className={styles.container}>
      <View className={styles.titleContainer}>
        <View className={styles.title}>{name}</View>
        <View className={cx}>{rank}</View>
      </View>
      <View className={styles.footer}>{score}</View>
    </View>
  )
}

export default HalfCard
