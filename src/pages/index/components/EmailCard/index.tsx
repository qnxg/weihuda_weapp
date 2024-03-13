import React from 'react'
import { View, Text } from '@tarojs/components'
import icon from '@/static/index/icon/email.svg'

import CardLayout from '../CardLayout'
import styles from './index.module.scss'

interface CardProps {
  unReadCount?: number
}

const EmailCard: React.FC<CardProps> = (props) => {
  const { unReadCount } = props
  return (
    <CardLayout icon={icon} title='校园邮箱'>
      <View className={styles.outer}>
        <View className={`${styles.item} ${styles.left}`}>
          <Text>未读邮件数: {unReadCount ? unReadCount : '查询失败'}</Text>
        </View>
      </View>
    </CardLayout>
  )
}

export default EmailCard
