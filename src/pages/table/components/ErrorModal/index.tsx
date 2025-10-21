import { View } from '@tarojs/components'
import React, { useState } from 'react'
import styles from './index.module.scss'

const ErrorModal: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true)

  const handleClick = () => {
    setIsVisible(false)
  }

  return (
    isVisible && (
      <View className={styles.container}>
        <View className={styles.dialog}>
          网络连接异常, 请稍后再试!
          <View className={styles.btn} onClick={handleClick}>
            我知道了
          </View>
        </View>
      </View>
    )
  )
}

export default ErrorModal
