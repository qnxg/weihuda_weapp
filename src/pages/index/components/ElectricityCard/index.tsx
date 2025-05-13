import { Text, View } from '@tarojs/components'
import React, { useCallback, useEffect } from 'react'
import CardLayout from '../CardLayout'
import CardProps from '../CardProps'
import styles from './index.module.scss'
import { getElectricityApi, getDormitoryApi } from '@/apis/electricity'
import icon from '@/static/index/icon/electricity.svg'
import usePromise from '@/utils/hooks/usePromise'

interface DisplayProps {
  electricity: string
  dormitory: string
}

const ElectricityCardDisplay: React.FC<DisplayProps> = (props) => {
  const { electricity, dormitory } = props
  return (
    <CardLayout icon={icon} title='宿舍电量' moreUrl='/queryPage/electricity/index' moreTitle='查看电量'>
      <View className={styles.outer}>
        <View className={`${styles.item} ${styles.left}`}>
          <Text>宿舍号: {dormitory ?? '未知'}</Text>
        </View>
        <View className={`${styles.item} ${styles.right}`}>
          <Text>剩余电量: {electricity ?? '查询失败'}</Text>
        </View>
      </View>
    </CardLayout>
  )
}

const ElectricityCard: React.FC<CardProps> = ({ onLoadingStatusChange, reloadController }) => {
  const getElectricityCardInfo = useCallback(async () => ({
    electricity: await getElectricityApi(),
    dormitory: (await getDormitoryApi())?.room ?? "未知",
  }), [])
  const [cardInfo, isCardInfoLoading] =
    usePromise(
      getElectricityCardInfo,
      {
        electricity: "查询失败",
        dormitory: "未知"
      }, [reloadController])
  useEffect(
    () => {
      onLoadingStatusChange(isCardInfoLoading)
    },
    [isCardInfoLoading, onLoadingStatusChange]
  )
  return <ElectricityCardDisplay
    electricity={cardInfo.electricity}
    dormitory={cardInfo.dormitory} />
}

export default ElectricityCard
