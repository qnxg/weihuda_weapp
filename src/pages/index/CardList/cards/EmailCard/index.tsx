import { View, Text } from '@tarojs/components'
import React, { useEffect } from 'react'
import CardLayout from '../utils/CardLayout'
import styles from './index.module.scss'
import { getUnReadCount } from '@/apis/pt/email'
import icon from '@/static/index/icon/email.svg'
import usePromise from '@/utils/hooks/usePromise'
import type CardProps from '../../CardProps'

interface DisplayProps {
  unReadCount: number | null
}

const EmailCardDisplay: React.FC<DisplayProps> = props => {
  const { unReadCount } = props

  const formatMsg = () => {
    if (unReadCount === null) {
      return '查询失败, 请到"个人门户/安全中心"绑定邮箱'
    }
    if (unReadCount === 0) {
      return '暂无新邮件'
    }
    return `您有 ${unReadCount} 封未读邮件`
  }

  return (
    <CardLayout icon={icon} title='校园邮箱'>
      <View className={styles.outer}>
        <View className={`${styles.item} ${styles.left}`}>
          <Text>{formatMsg()}</Text>
        </View>
      </View>
    </CardLayout>
  )
}

const EmailCard: React.FC<CardProps> = ({
  onLoadingStatusChange,
  reloadController,
}) => {
  const [unReadCount, isUnReadCountLoading] = usePromise(getUnReadCount, null, [
    getUnReadCount,
    reloadController,
  ])
  useEffect(() => {
    onLoadingStatusChange(isUnReadCountLoading)
  }, [isUnReadCountLoading, onLoadingStatusChange])
  return <EmailCardDisplay unReadCount={unReadCount} />
}

export default EmailCard
