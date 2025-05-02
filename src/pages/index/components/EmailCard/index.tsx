import React, { useEffect } from 'react'
import { View, Text } from '@tarojs/components'
import icon from '@/static/index/icon/email.svg'
import { getUnReadCount } from '@/apis/pt/email'
import usePromise from '@/utils/usePromise'

import CardLayout from '../CardLayout'
import styles from './index.module.scss'
import CardProps from '../CardProps'

interface DisplayProps {
  unReadCount?: number
}

const EmailCardDisplay: React.FC<DisplayProps> = (props) => {
  const { unReadCount } = props
  return (
    <CardLayout icon={icon} title='校园邮箱'>
      <View className={styles.outer}>
        <View className={`${styles.item} ${styles.left}`}>
          <Text>未读邮件数: {unReadCount ?? '查询失败'}</Text>
        </View>
      </View>
    </CardLayout>
  )
}

const EmailCard: React.FC<CardProps> = ({ onLoadingStatusChange, reloadController }) => {
  const [unReadCount, isUnReadCountLoading] =
    usePromise(getUnReadCount, undefined, [reloadController])
  useEffect(() => {
    onLoadingStatusChange(isUnReadCountLoading)
  }, [isUnReadCountLoading, onLoadingStatusChange])
  return <EmailCardDisplay unReadCount={unReadCount} />
}

export default EmailCard
