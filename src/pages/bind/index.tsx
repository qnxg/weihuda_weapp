import { View } from '@tarojs/components'
import classNames from 'classnames'
import React, { useState } from 'react'

import First from './components/First'
import Second from './components/Second'
import styles from './index.module.scss'

const Index: React.FC = () => {
  const [step, setStep] = useState(1)

  const circleStyle = classNames({
    [styles.stepCircle]: true,
    [styles.stepUnreach]: step === 1
  })

  const textStyle = classNames({
    [styles.unreach]: step === 1
  })

  return (
    <View className={styles.main}>
      <View className={styles.pattern}>
        <View className={styles.stepCircle}>1</View>
        <View className={styles.point} />
        <View className={styles.point} />
        <View className={styles.point} />
        <View className={styles.point} />
        <View className={styles.point} />
        <View className={circleStyle}>2</View>
      </View>
      <View className={styles.stepText}>
        <View>授权微信</View>
        <View className={textStyle}>身份认证</View>
      </View>
      {step === 1 ? <First setStep={setStep} /> : <Second />}
    </View>
  )
}

export default Index
