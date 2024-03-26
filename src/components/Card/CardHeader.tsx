import { View, Image } from '@tarojs/components'
import React from 'react'
import styles from './cardHeader.module.scss'

interface ICardTitleProps {
  /**
   * 卡片标题
   */
  title: string
  /**
   * 卡片图标
   */
  icon?: string
}

const CardHeader: React.FC<ICardTitleProps> = ({ title, icon }) => {
  return (
    <View className={styles.cardHeader}>
      <View className={styles.left}>
        {icon && <Image src={icon} className={styles.iconImg} />}
        <View className={styles.title}>{title}</View>
      </View>
      <View></View>
    </View>
  )
}

export default CardHeader
