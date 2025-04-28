import { CardInfo } from '@/apis/pt/card'
import icon from '@/static/index/icon/card.svg'
import { Text, View } from '@tarojs/components'
import React from 'react'
import CardLayout from '../CardLayout'
import styles from './index.module.scss'

interface CardProps {
  info?: CardInfo
}

/** 校园卡余额卡片 */
const CampusCard: React.FC<CardProps> = ({ info }) => {
  return (
    <CardLayout icon={icon} title='校园卡余额' moreUrl='/queryPage/card/index' moreTitle='查看账单'>
      <View className={styles.outer}>
        <View className={`${styles.item} ${styles.left}`}>
          <Text>卡号: {info ? info.account : '查询失败'}</Text>
        </View>
        <View className={`${styles.item} ${styles.mid}`}>
          <Text>余额: {info ? info.balance : '查询失败'}</Text>
        </View>
      </View>
    </CardLayout>
  )
}

export default CampusCard
