import { Image, View } from '@tarojs/components'
import React from 'react'

import styles from './index.module.scss'

export interface CardEmptyProps {
  /** 图案 */
  icon: string
  /** 文字提醒 */
  text: string
}

const CardEmpty: React.FC<CardEmptyProps> = props => {
  return (
    <View className={styles.empty}>
      <Image src={props.icon} className={styles.img} />
      <View className={styles.text}>{props.text}</View>
    </View>
  )
}

export default CardEmpty
