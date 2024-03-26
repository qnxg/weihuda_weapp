import { View, ViewProps } from '@tarojs/components'
import classNames from 'classnames'
import React from 'react'
import styles from './index.module.scss'

interface IEmptyProps extends ViewProps {
  loading?: boolean
}

const Empty: React.FC<IEmptyProps> = (props) => {
  const className = classNames(styles.empty, props.className)
  return (
    <View {...props} className={className}>
      <View>{props.children}</View>
    </View>
  )
}

export default Empty
