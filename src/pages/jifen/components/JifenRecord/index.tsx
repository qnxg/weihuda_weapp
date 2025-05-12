import { IJifenRecord, getJifenRecordPageApi } from '@/apis/jifen'
import { View } from '@tarojs/components'
import classNames from 'classnames'
import dayjs from 'dayjs'
import React, { useEffect } from 'react'
import styles from './index.module.scss'

interface IJifenRecordProps {
  updateTotal?: () => void
  jifenRecordRef?: React.MutableRefObject<any>
}

const JifenRecord: React.FC<IJifenRecordProps> = (props) => {
  const [loading, setLoading] = React.useState(true)
  const [data, setData] = React.useState<IJifenRecord[]>([])

  // 获取列表数据
  const getData = async () => {
    const res = await getJifenRecordPageApi({
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

  // 通过ref暴露给父组件调用
  const updateJifenRecord = () => {
    void getData()
  }
  if (props.jifenRecordRef) {
    props.jifenRecordRef.current = { updateJifenRecord }
  }

  return (
    <View className={styles.recordContainer}>
      <View>
        {data.map((item) => (
          <View key={item.id} className={styles.recordItem}>
            <View className={styles.recordCreateTime}>{dayjs(item.createTime).format('YYYY-MM-DD')}</View>
            <View className={styles.recordDesc}>{item.desc}</View>
            <View
              className={classNames(styles.recordJifen, {
                [styles.reduce]: item.jifen < 0
              })}
            >
              {item.jifen > 0 ? '+' : ''}
              {item.jifen}
            </View>
          </View>
        ))}
      </View>
      {data.length === 0 && (
        <View className={styles.empty}>
          <View>{loading ? '加载中...' : '暂无数据'}</View>
        </View>
      )}
    </View>
  )
}

export default JifenRecord
