import { View, ViewProps } from '@tarojs/components'
import classNames from 'classnames'
import React from 'react'
import styles from './index.module.scss'

interface Props extends ViewProps {

}

/**
 * 按钮组件
 */
const Card: React.FC<Props> = (props) => {
  props.className = classNames(props.className, styles.card)
  return <View className={styles.cardWrapper}>
    <View {...props}></View>
  </View>
}

export default Card
