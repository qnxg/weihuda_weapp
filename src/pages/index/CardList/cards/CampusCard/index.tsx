import { Text, View } from '@tarojs/components'
import React, { useEffect } from 'react'
import CardLayout from '../utils/CardLayout'
import styles from './index.module.scss'
import { getCardInfo } from '@/apis/pt/card'
import icon from '@/static/index/icon/card.svg'
import usePromise from '@/utils/hooks/usePromise'
import type CardProps from '../../CardProps'
import type { CardInfo} from '@/apis/pt/card';

interface DisplayProps {
  info?: CardInfo
}

/** 校园卡余额卡片 */
const CampusCardDisplay: React.FC<DisplayProps> = ({ info }) => {
  return (
    <CardLayout icon={icon} title='校园卡余额' moreUrl='/queryPage/card/index' moreTitle='查看账单'>
      <View className={styles.outer}>
        <View className={`${styles.item} ${styles.left}`}>
          <Text>卡号: {info ? info.account : '查询失败'}</Text>
        </View>
        <View className={`${styles.item} ${styles.mid}`}>
          <Text>余额: {info ? info.balance : '查询失败'}</Text>
        </View>
      </View>
    </CardLayout>
  )
}

const CampusCard: React.FC<CardProps> = ({ onLoadingStatusChange, reloadController }) => {
  const [cardData, isCardDataLoading] =
    usePromise(getCardInfo, undefined, [reloadController]);
  useEffect(() => {
    onLoadingStatusChange(isCardDataLoading)
  }, [isCardDataLoading, onLoadingStatusChange])
  return <CampusCardDisplay info={cardData} />
}

export default CampusCard
