import { View, ViewProps } from '@tarojs/components'
import classNames from 'classnames'
import React from 'react'
import styles from './index.module.scss'

interface Props extends ViewProps {
  /**
   * 外部容器类名
   */
  wrapperClassName?: string
}

/**
 * 按钮组件
 */
const Card: React.FC<Props> = (props) => {
  props.className = classNames(props.className, styles.card)
  const wrapperClassName = classNames(styles.cardWrapper, props.wrapperClassName)
  return <View className={wrapperClassName}>
    <View {...props}></View>
  </View>
}

export default Card
