import { Text, View } from '@tarojs/components'
import React from 'react'
import styles from './index.module.scss'

const BubbleNotification: React.FC<{
  content: string
  onClose: () => void
}> = ({ content, onClose }) => {
  return (
    <View className={styles.bubbleNotification} onClick={onClose}>
      <Text>{content}</Text>
    </View>
  )
}

export default BubbleNotification
