import { View } from '@tarojs/components'
import classNames from 'classnames'
import React, { useEffect } from 'react'
import styles from './index.module.scss'
import { getJifenRulePageApi } from '@/apis/jifen'
import { getMiniConfigPageApi } from '@/apis/miniConfig'
import type { IJifenRule} from '@/apis/jifen';

const JifenRule: React.FC = () => {
  const [loading, setLoading] = React.useState(true)
  const [data, setData] = React.useState<IJifenRule[]>([])
  const [exteraRule, setExteraRule] = React.useState<string>('')

  const getData = async () => {
    await getMiniConfigPageApi({
      key: 'exteraJifenRules'
    }).then((res) => {
      if (res.rows.length === 0) return;
      setExteraRule(res.rows[0].value)
    })
    const res = await getJifenRulePageApi({
      page: 1,
      pageSize: 20
    })
    setLoading(false)
    if (res) {
      setData(res.rows)
    }
  }

  useEffect(() => {
    void getData()
  }, [])

  return (
    <View className={styles.ruleContainer}>
      <View>
        <View className={styles.ruleItem}>
          <View className={styles.ruleDesc}>动作</View>
          <View className={classNames(styles.ruleJifen)}>积分</View>
        </View>
        {data.map((item) => (
          <View key={item.id} className={styles.ruleItem}>
            <View className={styles.ruleDesc}>{item.name}</View>
            <View
              className={classNames(styles.ruleJifen, {
                [styles.reduce]: item.jifen < 0
              })}
            >
              {item.jifen > 0 ? '+' : ''}
              {item.jifen}
            </View>
          </View>
        ))}
      </View>
      {exteraRule && (
        <View className={styles.exteraRule}>
          <View className={styles.exteraTitle}>其他说明</View>
          <View dangerouslySetInnerHTML={{ __html: exteraRule }} />
          {/* <RichText nodes={exteraRule} /> */}
        </View>
      )}
      {data.length === 0 && (
        <View className={styles.empty}>
          <View>{loading ? '加载中...' : '暂无数据'}</View>
        </View>
      )}
    </View>
  )
}

export default JifenRule
