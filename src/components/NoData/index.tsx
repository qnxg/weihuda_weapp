import { View, Image } from '@tarojs/components'
import React from 'react'
import styles from './index.module.scss'
import iconNoJK from '@/static/empty/no-exam.svg'

interface NoDataProps {
  text: string
  icon?: string
}

const NoData: React.FC<NoDataProps> = props => {
  const { text, icon } = props
  return (
    <View className={styles.container}>
      <Image src={icon ?? iconNoJK} className={styles.icon} />
      <View className={styles.text}>{text}</View>
    </View>
  )
}

export default NoData
