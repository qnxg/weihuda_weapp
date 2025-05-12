import { getJifenTotalApi } from '@/apis/jifen'
import Card from '@/components/Card'
import { TabPanel, Tabs } from '@/components/Tabs'
import { useAppSelector } from '@/utils/hooks/redux'
import { View } from '@tarojs/components'
import React, { useEffect } from 'react'
import styles from './index.module.scss'
import Qiandao from './components/Qiandao'
import Goods from './components/Goods'
import JifenRecord from './components/JifenRecord'
import JifenRule from './components/JifenRule'

const Index: React.FC = () => {
  const userInfo = useAppSelector((state) => state.userInfo)
  const [total, setTotal] = React.useState(0)
  const jifenRecordRef = React.useRef<any>(null)

  // 获取总积分
  const getData = async () => {
    const res = await getJifenTotalApi()
    if (res) {
      setTotal(res.jifen)
    }
  }

  const updateJifenRecord = () => {
    if (jifenRecordRef.current && jifenRecordRef.current.updateJifenRecord) {
      jifenRecordRef.current.updateJifenRecord()
    }
  }

  useEffect(() => {
    void getData()
  }, [])

  return (
    <View className={styles.wrapper}>
      {/* 积分数展示卡片 */}
      <Card className={styles.myJifenCard}>
        <View className={styles.left}>
          <View className={styles.username}>{userInfo.name}</View>
        </View>
        <View className={styles.right}>
          <View className='title'>我的积分</View>
          <View className={styles.myCount}>{total}</View>
        </View>
      </Card>
      {/* 签到 */}
      <Card className={styles.qiandao}>
        <Qiandao updateTotal={getData} updateJifenRecord={updateJifenRecord} />
      </Card>
      {/* 兑换奖品，积分记录，积分规则 */}
      <Card wrapperClassName={styles.jifenActionsCard}>
        <Tabs keepAlive initialValue={0}>
          <TabPanel value={0} title='积分记录'>
            <JifenRecord jifenRecordRef={jifenRecordRef} />
          </TabPanel>
          <TabPanel value={1} title='兑换奖品'>
            <Goods total={total} updateTotal={getData} updateJifenRecord={updateJifenRecord} />
          </TabPanel>
          <TabPanel value={2} title='积分规则'>
            <JifenRule />
          </TabPanel>
        </Tabs>
      </Card>
    </View>
  )
}

export default Index
