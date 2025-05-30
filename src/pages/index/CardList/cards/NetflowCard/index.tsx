import { Image, Text, View } from '@tarojs/components'
import React, { useEffect } from 'react'
import CardLayout from '../utils/CardLayout'
import GradeBanner from './components/GradeBanner'
import styles from './index.module.scss'
import { getNetflow } from '@/apis/netflow'
import downloadIcon from '@/static/icon/download.svg'
import uploadIcon from '@/static/icon/upload.svg'
import icon from '@/static/index/icon/network.svg'
import usePromise from '@/utils/hooks/usePromise'
import type CardProps from '../../CardProps'
import type { NetflowData } from '@/apis/netflow';

interface NetFlowCardProps {
  netFlow?: NetflowData
}

const NetflowCardDisplay: React.FC<NetFlowCardProps> = ({ netFlow }) => {
  return (
    <CardLayout icon={icon} title='本月流量' moreUrl='/queryPage/netflowDetail/index' moreTitle='流量详情'>
      <View className={styles.outer}>
        <View className={styles.row}>
          <View className={`${styles.item} ${styles.left}`}>
            <Text>{netFlow?.thisMonth?.download ?? '无数据'}</Text>
            <Image className={styles.img} src={downloadIcon} />
          </View>
          <View className={`${styles.item} ${styles.mid}`}>
            <Text>{netFlow?.thisMonth?.upload ?? '无数据'}</Text>
            <Image className={styles.img} src={uploadIcon} />
          </View>
          <View className={`${styles.item} ${styles.right}`}>
            <Text className={styles.txt}>{netFlow?.unlock ?? '无数据'}</Text>
          </View>
        </View>
        <View className={styles.row}>
          <View className={`${styles.item} ${styles.left}`}>
            {`当前欠费：${netFlow?.payInfo !== undefined ? `${netFlow.payInfo}元` : '无数据'}`}
          </View>
          <View className={`${styles.item} ${styles.right}`}>
            <Text>{`超出流量：${
              netFlow?.thisMonth?.extendPackageUsed !== undefined ? `${netFlow.thisMonth.extendPackageUsed}G` : '无数据'
            }`}</Text>
          </View>
        </View>
        <View className={styles.row}>
          <GradeBanner
            grade={{
              name: '免费流量：',
              score: (netFlow?.thisMonth?.basePackageUsedPer ?? 0) * 100,
              content: `${netFlow?.thisMonth?.basePackageUsed ?? '--'}G`
            }}
          />
        </View>
      </View>
    </CardLayout>
  )
}

const NetflowCard: React.FC<CardProps> = ({ onLoadingStatusChange, reloadController }) => {
  const [netflowData, isNetflowDataLoading] =
    usePromise(getNetflow, undefined, [reloadController])
  useEffect(() => {
    onLoadingStatusChange(isNetflowDataLoading)
  }, [isNetflowDataLoading, onLoadingStatusChange])
  return <NetflowCardDisplay netFlow={netflowData} />
}

export default NetflowCard
