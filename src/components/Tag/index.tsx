import { View } from '@tarojs/components'
import classNames from 'classnames'
import React from 'react'
import styles from './index.module.scss'

interface TagProps extends React.PropsWithChildren<{}> {
  /**
   * 标签颜色
   */
  theme?: 'default' | 'primary' | 'success' | 'warning' | 'danger'
}

const Tag: React.FC<TagProps> = ({ children, theme = 'default' }) => {
  const className = classNames(styles.tag, styles[theme])
  return <View className={className}>{children}</View>
}

export default Tag
