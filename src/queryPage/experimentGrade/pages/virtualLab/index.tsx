import { View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useEffect, useState } from 'react'
import { getVirtualLabGrade } from '@/apis/lab'
import DisplayCard from '@/components/DisplayCard'
import NoData from '@/components/NoData'
import PullRefresh from '@/components/PullRefresh'
import type { VirtualLabGrade } from '@/apis/lab'

const VirtualLabIndex: React.FC = () => {
  const [grade, setGrade] = useState<VirtualLabGrade[]>([])
  const getData = async () => {
    await Taro.showLoading({
      mask: true,
      title: '加载中...',
    })
    try {
      const res = await getVirtualLabGrade()
      if (!res) {
        Taro.hideLoading()
        await Taro.navigateTo({
          url: '/settingsPage/labBindSettings/index?tips=true',
        })
        return
      }
      setGrade(res)
    } catch (err) {
      await Taro.showToast({
        icon: 'none',
        title: err.toString(),
      })
    }
    Taro.hideLoading()
  }
  const onRefresh = async (close: () => void) => {
    await getData()
    close()
  }
  useEffect(() => {
    void getData()
  }, [])
  return (
    <PullRefresh runFunc={onRefresh} topGap={72}>
      {grade.length > 0 ? (
        grade.map(item => (
          <DisplayCard title={item.lab_name} key={item.lab_name}>
            <View>分数：{item.lab_score} 分</View>
          </DisplayCard>
        ))
      ) : (
        <NoData text='暂时没有虚拟实验成绩' />
      )}
    </PullRefresh>
  )
}

export default VirtualLabIndex
