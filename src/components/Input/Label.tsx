import { View, ViewProps } from '@tarojs/components'
import classNames from 'classnames'
import React from 'react'
import styles from './index.module.scss'

interface Props extends ViewProps {
  /**
   * 必填标志
   */
  required?: boolean
}

/**
 * Label组件
 */
const Label: React.FC<Props> = (props) => {
  const { required } = props
  // Label项类名
  const labelItemClassName = classNames(styles.label, props.className, {
    [styles.required]: required
  })

  return (
    <View {...props} className={labelItemClassName}>
      {props.children}
    </View>
  )
}

export default Label
