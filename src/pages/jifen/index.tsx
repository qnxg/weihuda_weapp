import Card from '@/components/Card'
import { TabPanel, Tabs } from '@/components/Tabs'
import { useAppSelector } from '@/hooks/redux'
import { View } from '@tarojs/components'
import React from 'react'
import styles from './index.module.scss'

const Index: React.FC = () => {
  const userInfo = useAppSelector((state) => state.userInfo)

  return (
    <View className={styles.wrapper}>
      {/* 积分数展示卡片 */}
      <Card className={styles.myJifenCard}>
        <View className={styles.left}>
          <View className={styles.username}>{userInfo.name}艾麦尔·艾买提</View>
        </View>
        <View className={styles.right}>
          <View className='title'>我的积分</View>
          <View className={styles.myCount}>20</View>
        </View>
      </Card>
      {/* 兑换奖品，积分记录，积分规则 */}
      <Card className={styles.myJifenCard1}>
        <Tabs>
          <TabPanel value={0} title='兑换奖品'>
            兑换奖品
          </TabPanel>
          <TabPanel value={1} title='积分记录'>
            积分记录
          </TabPanel>
          <TabPanel value={2} title='积分规则'>
            积分规则
          </TabPanel>
        </Tabs>
      </Card>
    </View>
  )
}

export default Index
