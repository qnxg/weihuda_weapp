import { View } from '@tarojs/components'
import classNames from 'classnames'
import React from 'react'
import styles from './index.module.scss'
import { getExtraRules, getJifenRulePageApi } from '@/apis/jifen'
import usePromise from '@/utils/hooks/usePromise'

const getNormalRules = async () =>
  (
    await getJifenRulePageApi({
      page: 1,
      pageSize: 20,
    })
  ).rows

const JifenRule: React.FC = () => {
  const [extraRules, loadingExtraRules] = usePromise(getExtraRules, '', [
    getExtraRules,
  ])
  const [normalRules, loadingNormalRules] = usePromise(
    getNormalRules,
    [],
    [getNormalRules]
  )

  return (
    <View className={styles.ruleContainer}>
      <View>
        <View className={styles.ruleItem}>
          <View className={styles.ruleDesc}>动作</View>
          <View className={classNames(styles.ruleJifen)}>积分</View>
        </View>
        {normalRules.map(item => (
          <View key={item.id} className={styles.ruleItem}>
            <View className={styles.ruleDesc}>{item.name}</View>
            <View
              className={classNames(styles.ruleJifen, {
                [styles.reduce]: item.jifen < 0,
              })}
            >
              {item.jifen > 0 ? '+' : ''}
              {item.jifen}
            </View>
          </View>
        ))}
      </View>
      {extraRules && (
        <View className={styles.exteraRule}>
          <View className={styles.exteraTitle}>其他说明</View>
          <View dangerouslySetInnerHTML={{ __html: extraRules }} />
          {/* <RichText nodes={exteraRule} /> */}
        </View>
      )}
      {normalRules.length === 0 && (
        <View className={styles.empty}>
          <View>
            {loadingExtraRules && loadingNormalRules ? '加载中...' : '暂无数据'}
          </View>
        </View>
      )}
    </View>
  )
}

export default JifenRule
