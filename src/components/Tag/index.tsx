import { View } from '@tarojs/components'
import React from 'react'
import styles from './index.module.scss'

const Tag: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <View className={styles.tag}>{children}</View>
}

export default Tag
