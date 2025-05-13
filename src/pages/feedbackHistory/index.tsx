import { Input, View } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import { useEffect, useState } from 'react'
import styles from './index.module.scss'
import { getFeedbackPageApi } from '@/apis/feedback'
import Button from '@/components/Button'
import type { FeedbackData} from '@/apis/feedback';

const statusMap = {
  0: '待确认',
  1: '已确认，待处理',
  2: '正在处理',
  3: '已处理并关闭'
}

const Index: React.FC = () => {
  const { params } = useRouter()
  const [stuId, setStuId] = useState<string>(params.stuId || '')

  const [data, setData] = useState<FeedbackData[]>([])

  // 请求反馈历史列表
  const getData = async (stuIdParam: string) => {
    await Taro.showLoading()
    try {
      const res = await getFeedbackPageApi(stuIdParam)
      if (res) {
        setData(res.rows)
        Taro.hideLoading()
        await Taro.showToast({
          title: '查询成功',
          icon: 'success'
        })
      }
    } catch {
      Taro.hideLoading()
    }
  }

  // 点击查询按钮时
  const handleSubmit = async () => {
    // 非空检查
    if (stuId.trim() === '') {
      await Taro.showToast({
        title: '学号不能为空',
        icon: 'none'
      })
      return
    }

    // 长度检查
    if (stuId.trim().length !== 12) {
      await Taro.showToast({
        title: '学号必须是12位',
        icon: 'none'
      })
      return
    }

    // 请求数据
    await getData(stuId)
  }

  // 进入页面时发起请求
  useEffect(() => {
    if (stuId === '') {
      return
    }

    // 请求数据
    void getData(stuId)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <View className={styles.container}>
      <View className={styles.form}>
        <Input
          value={stuId}
          onInput={(e) => {
            setStuId((e.target as any).value)
          }}
          className={styles.input}
          type='text'
          placeholder='请输入学号'
        />
        <Button onClick={handleSubmit} className={styles.submitButton}>
          查询
        </Button>
      </View>
      <View className={styles.historyList}>
        {data.map((item, i) => {
          return (
            <View key={i} className={styles.historyCard}>
              <View className={styles.label}>反馈内容：</View>
              <View>{item.desc}</View>
              <View className={styles.label}>处理状态：{statusMap[item.status]}</View>
              <View className={styles.label}>处理结果：</View>
              <View>{item.comment}</View>
            </View>
          )
        })}
      </View>
    </View>
  )
}

export default Index
