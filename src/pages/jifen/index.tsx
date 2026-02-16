import { View } from '@tarojs/components'
import React, { useEffect, useMemo } from 'react'
import Goods from './components/Goods'
import JifenRecord from './components/JifenRecord'
import JifenRule from './components/JifenRule'
import Qiandao from './components/Qiandao'
import styles from './index.module.scss'
import { getJifenTotalApi } from '@/apis/jifen'
import { getUserInfoApi } from '@/apis/userInfo'
import Card from '@/components/Card'
import { Tabs } from '@/components/Tabs'
import usePromise from '@/utils/hooks/usePromise'

const Index: React.FC = () => {
  const [userInfo] = usePromise(getUserInfoApi, null, [getUserInfoApi])

  const [total, setTotal] = React.useState(0)
  const jifenRecordRef = React.useRef<any>(null)

  // 获取总积分
  const getData = async () => {
    const res = await getJifenTotalApi()
    setTotal(res)
  }

  const updateJifenRecord = () => {
    if (jifenRecordRef.current && jifenRecordRef.current.updateJifenRecord) {
      jifenRecordRef.current.updateJifenRecord()
    }
  }

  useEffect(() => {
    void getData()
  }, [])

  function signedCallback() {
    void getData()
    updateJifenRecord()
  }

  return (
    <View className={styles.wrapper}>
      {/* 积分数展示卡片 */}
      <Card className={styles.myJifenCard}>
        <View className={styles.left}>
          <View className={styles.username}>{userInfo?.name ?? ''}</View>
        </View>
        <View className={styles.right}>
          <View className='title'>我的积分</View>
          <View className={styles.myCount}>{total}</View>
        </View>
      </Card>
      {/* 签到 */}
      <Card className={styles.qiandao}>
        <Qiandao signedCallback={signedCallback} />
      </Card>
      {/* 兑换奖品，积分记录，积分规则 */}
      <Card wrapperClassName={styles.jifenActionsCard}>
        <Tabs
          loadAll
          defaultPanelIndex={0}
          panels={useMemo(
            () => [
              {
                title: '积分记录',
                component: <JifenRecord jifenRecordRef={jifenRecordRef} />,
              },
              {
                title: '兑换奖品',
                component: (
                  <Goods
                    total={total}
                    updateTotal={getData}
                    updateJifenRecord={updateJifenRecord}
                  />
                ),
              },
              {
                title: '积分规则',
                component: <JifenRule />,
              },
            ],
            [total]
          )}
        />
      </Card>
    </View>
  )
}

export default Index
