import { View } from '@tarojs/components'
import classNames from 'classnames'
import React from 'react'
import styles from './index.module.scss'
import type { ViewProps } from '@tarojs/components'

interface Props extends ViewProps {
  /**
   * 外部容器类名
   */
  wrapperClassName?: string
  /**
   * 是否需要卡片内的内边距，默认为true
   */
  needExtraPadding?: boolean
}

/**
 * 卡片组件
 */
const Card: React.FC<Props> = props => {
  const needExtrapadding = props.needExtraPadding ?? true
  props.className = classNames(props.className, styles.card, {
    [styles.extraPadding]: needExtrapadding,
  })
  const wrapperClassName = classNames(
    styles.cardWrapper,
    props.wrapperClassName
  )
  return (
    <View className={wrapperClassName}>
      <View {...props}></View>
    </View>
  )
}

export default Card
