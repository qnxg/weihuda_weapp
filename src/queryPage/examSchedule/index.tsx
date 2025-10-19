import Taro from '@tarojs/taro'
import React, { useEffect, useState } from 'react'
import AllPage from './components/allPage'
import CalenderPage from './components/calendarPage'
import { getExamArrange } from '@/apis/hdjw/examArrange'
import PullRefresh from '@/components/PullRefresh'
import Tabs from '@/components/Tab'
import type { ExamArrange } from '@/apis/hdjw/examArrange'

const Index: React.FC = () => {
  const [index, setIndex] = useState(0)

  const [data, setData] = useState<ExamArrange[] | null>(null)

  /**
   * 获取数据
   */
  const getData = async () => {
    await Taro.showLoading({
      mask: true,
      title: '加载中...',
    })
    try {
      const res = await getExamArrange()
      setData(res)
    } catch (err) {
      await Taro.showToast({
        icon: 'none',
        title: err.toString(),
      })
    } finally {
      Taro.hideLoading()
    }
  }

  useEffect(() => {
    void getData()
  }, [])

  const onRefresh = async (close: () => void) => {
    await getData()
    close()
  }

  // 2个页面的转换
  const onChangeTab = (page: number): void => {
    setIndex(page)
  }

  return (
    <Tabs
      current={index}
      onChange={onChangeTab}
      items={[
        {
          key: '全部考试',
          label: '全部考试',
          body: (
            <PullRefresh runFunc={onRefresh} topGap={88}>
              <AllPage exam={data ? data : []} />
            </PullRefresh>
          ),
        },
        {
          key: '考试日历',
          label: '考试日历',
          body: (
            <PullRefresh runFunc={onRefresh} topGap={88}>
              <CalenderPage exam={data ? data : []} />
            </PullRefresh>
          ),
        },
      ]}
    ></Tabs>
  )
}

export default Index
