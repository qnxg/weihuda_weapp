import { Image, View, ViewProps } from '@tarojs/components'
import classNames from 'classnames'
import React from 'react'
import styles from './cardHeader.module.scss'

interface ICardTitleProps extends ViewProps {
  /**
   * 卡片标题
   */
  title: string | React.ReactNode
  /**
   * 右侧内容
   */
  footer?: string | React.ReactNode
  /**
   * 卡片图标
   */
  icon?: string
}

const CardHeader: React.FC<ICardTitleProps> = (props) => {
  const { title, icon, footer } = props
  const className = classNames(styles.cardHeader, props.className)
  return (
    <View {...props} className={className}>
      <View className={styles.left}>
        {icon && <Image src={icon} className={styles.iconImg} />}
        <View className={styles.title}>{title}</View>
      </View>
      <View className={styles.right}>{footer}</View>
    </View>
  )
}

export default CardHeader
