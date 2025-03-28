import { Image, View } from '@tarojs/components'
import classNames from 'classnames'
import icon from '@/static/icon/warning.svg'
import React from 'react'
import styles from './index.module.scss'

interface CardProps {
  info: string
  variant: 'success' | 'error' | 'warning'
}

const AlertCard: React.FC<CardProps> = ({ info }) => {
  return (
    <View className={styles.box}>
      <View className={classNames(styles.content, 'flex')}>
        <Image className={styles.icon} src={icon} />
        <View className='flex-1 self-center ml-1'>{info}</View>
      </View>
    </View>
  )
}

export default AlertCard
