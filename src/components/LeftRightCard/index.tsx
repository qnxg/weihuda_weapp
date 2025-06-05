import { View } from '@tarojs/components'
import React from 'react'

import styles from './index.module.scss'
import type { CSSProperties } from 'react'

interface Props {
  key?: string | number
  className?: string
  style?: string | CSSProperties
  lineColor: string
  renderLeft: JSX.Element
  renderRight: JSX.Element
}

const LineDividedLeftRightCard: React.FC<Props> = props => {
  const { className, style, lineColor } = props
  return (
    <View
      className={
        className
          ? `${styles.lineDivideCard} ${className}`
          : styles.lineDivideCard
      }
      style={style}
    >
      <View className={styles.left}>{props.renderLeft}</View>
      <View className={styles.divide} style={{ backgroundColor: lineColor }} />
      <View className={styles.right}>{props.renderRight}</View>
    </View>
  )
}

export default LineDividedLeftRightCard
