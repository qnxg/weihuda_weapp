import { Image, View } from '@tarojs/components'
import React from 'react'

import styles from './index.module.scss'
import img from '@/static/404.svg'

const Index: React.FC = () => {
  return (
    <View className={styles.cardOuter}>
      <View className={styles.card}>
        <Image className={styles.pic} src={img} />
      </View>
    </View>
  )
}

export default Index as any
