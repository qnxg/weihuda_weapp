import { View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useEffect, useState } from 'react'
import styles from './index.module.scss'
import { getFeedbackMsg, getFeedbackPageApi } from '@/apis/feedback'
import NoData from '@/components/NoData'
import type { FeedbackInfo } from '@/apis/feedback'

const statusMap = {
  0: '待确认',
  1: '已确认，待处理',
  2: '正在处理',
  3: '已处理并关闭',
}

const Index: React.FC = () => {
  interface FeedbackHistoryItem {
    info: FeedbackInfo
    msg?: string
  }
  const [data, setData] = useState<FeedbackHistoryItem[]>([])

  // 请求反馈历史列表
  const getData = async () => {
    await Taro.showLoading()
    try {
      const res: FeedbackHistoryItem[] = []
      const feedbackList = (await getFeedbackPageApi(1)).rows
      for (const item of feedbackList) {
        const msgList = await getFeedbackMsg(item.id)
        res.push({
          info: item,
          msg: msgList.length > 0 ? msgList[0]?.msg : undefined,
        })
      }
      setData(res)
    } finally {
      Taro.hideLoading()
    }
  }

  // 进入页面时发起请求
  useEffect(() => {
    // 请求数据
    void getData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <View className={styles.container}>
      {data.length === 0 ? (
        <NoData text='暂无反馈历史' />
      ) : (
        <View className={styles.historyList}>
          {data.map((item, i) => {
            return (
              <View key={i} className={styles.historyCard}>
                <View className={styles.label}>反馈内容：</View>
                <View>{item.info.desc}</View>
                <View className={styles.label}>
                  处理状态：{statusMap[item.info.status]}
                </View>
                {item.msg && (
                  <>
                    <View className={styles.label}>处理结果：</View>
                    <View>{item.msg}</View>
                  </>
                )}
              </View>
            )
          })}
        </View>
      )}
    </View>
  )
}

export default Index
