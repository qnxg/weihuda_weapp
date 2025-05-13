import Taro from '@tarojs/taro'
import React, { useEffect, useState } from 'react'
import AllPage from './components/allPage'
import CalenderPage from './components/calendarPage'
import { ExamArrange, getExamArrange } from '@/apis/hdjw/examArrange'
import PullRefresh from '@/components/PullRefresh'
import Tabs from '@/components/Tab'
import Panel from '@/components/Tab/components/Panel'


const pages = ['全部考试', '考试日历']

const Index: React.FC = () => {
  const [index, setIndex] = useState(0)

  const [data, setData] = useState<ExamArrange[] | null>(null)

  /**
   * 获取数据
   */
  const getData = async () => {
    await Taro.showLoading({
      mask: true,
      title: '加载中...'
    })
    try {
      const res = await getExamArrange()
      setData(res)
    } catch (err) {
      await Taro.showToast({
        icon: 'none',
        title: err.toString()
      })
    } finally {
      Taro.hideLoading()
    }
  }

  useEffect(() => {
    void getData()
  }, [])

  const onRefresh = async (close) => {
    await getData()
    close()
  }

  // 2个页面的转换
  const onChangeTab = (page: number): void => {
    setIndex(page)
  }

  return (
    <Tabs items={pages} current={index} onChange={onChangeTab}>
      <Panel current={index} index={0}>
        <PullRefresh runFunc={onRefresh} topGap={88}>
          <AllPage exam={data ? data : []} />
        </PullRefresh>
      </Panel>
      <Panel current={index} index={1}>
        <PullRefresh runFunc={onRefresh} topGap={88}>
          <CalenderPage exam={data ? data : []} />
        </PullRefresh>
      </Panel>
    </Tabs>
  )
}

export default Index
