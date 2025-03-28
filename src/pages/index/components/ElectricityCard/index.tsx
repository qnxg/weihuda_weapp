import React from 'react'
import { View, Text } from '@tarojs/components'
import icon from '@/static/index/icon/electricity.svg'

import CardLayout from '../CardLayout'
import styles from './index.module.scss'

interface CardProps {
  electricity?: string
}

const ElectricityCard: React.FC<CardProps> = (props) => {
  const { electricity } = props
  return (
    <CardLayout icon={icon} title='宿舍电量' moreUrl='/queryPage/electricity/index' moreTitle='查看电量'>
      <View className={styles.outer}>
        <View className={`${styles.item} ${styles.left}`}>
          <Text>剩余电量: {electricity ?? '查询失败'}</Text>
        </View>
      </View>
    </CardLayout>
  )
}

export default ElectricityCard
