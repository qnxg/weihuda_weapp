import { View } from '@tarojs/components'
import Taro, { usePullDownRefresh } from '@tarojs/taro'
import React, { useEffect, useState } from 'react'
import { NtflowOrderItem, getNetflowOrder } from '@/apis/netflow'
import DisplayCard from '@/components/DisplayCard'

const Index: React.FC = () => {
  const [data, setData] = useState<NtflowOrderItem[] | null>(null)

  /**
   * 获取数据
   */
  const getData = async () => {
    await Taro.showLoading({
      mask: true,
      title: '加载中...'
    })
    try {
      const res = await getNetflowOrder()
      if (res) {
        setData(res)
      }
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

  usePullDownRefresh(() => {
    void getData()
    Taro.stopPullDownRefresh()
  })

  return (
    <view>
      {data &&
        data.map((item) => {
          return (
            <DisplayCard
              title={item.month}
              subTitle={String(item.shouldPay) + '元'}
              key={Math.random()}
              footer={'更新于：' + item.updateTime}
            >
              <View>上传流量：{item.uploadName}</View>
              <View>下载流量：{item.downloadName}</View>
              <View>超额流量：{item.realOverTraffic} GB</View>
            </DisplayCard>
          )
        })}
      <DisplayCard>
        <View style='text-align: center;'>见底了</View>
      </DisplayCard>
    </view>
  )
}

export default Index
