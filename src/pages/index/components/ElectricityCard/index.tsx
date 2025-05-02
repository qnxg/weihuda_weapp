import icon from '@/static/index/icon/electricity.svg'
import { Text, View } from '@tarojs/components'
import React from 'react'
import CardLayout from '../CardLayout'
import styles from './index.module.scss'

interface CardProps {
  electricity: string
  dormitory: string
}

const ElectricityCard: React.FC<CardProps> = (props) => {
  const { electricity, dormitory } = props
  return (
    <CardLayout icon={icon} title='宿舍电量' moreUrl='/queryPage/electricity/index' moreTitle='查看电量'>
      <View className={styles.outer}>
        <View className={`${styles.item} ${styles.left}`}>
          <Text>宿舍号: {dormitory ?? '未知'}</Text>
        </View>
        <View className={`${styles.item} ${styles.right}`}>
          <Text>剩余电量: {electricity ?? '查询失败'}</Text>
        </View>
      </View>
    </CardLayout>
  )
}

export default ElectricityCard
