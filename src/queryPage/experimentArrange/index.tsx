import { View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import dayjs from 'dayjs'
import React, { Fragment, useEffect, useState } from 'react'
import { getLabArrange } from '@/apis/lab'
import DisplayCard from '@/components/DisplayCard'
import NoData from '@/components/NoData'
import PullRefresh from '@/components/PullRefresh'
import type { LabArrange } from '@/apis/lab';

const Index: React.FC = () => {
  const [show, setShow] = useState(false)
  const [data, setData] = useState<LabArrange[]>([])

  /**
   * 获取数据
   */
  const getData = async () => {
    await Taro.showLoading({
      mask: true,
      title: '加载中...',
    })
    try {
      const res = await getLabArrange()
      if (res) {
        setData(res)
        setShow(true)
      } else {
        setShow(false)
        setData([])
        await Taro.navigateTo({
          url: '/settingsPage/labBindSettings/index?tips=true',
        })
      }
    } catch (err) {
      setShow(false)
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

  return (
    <Fragment>
      <PullRefresh runFunc={onRefresh}>
        {show && data.length > 0 ? (
          <View style={{ padding: 0 }}>
            {data.map(item => {
              const rest = dayjs(item.date).diff(dayjs(), 'day')
              return (
                <DisplayCard
                  title={item.name}
                  key={Math.random()}
                  subTitle={rest >= 0 ? `${rest}天` : '已结束'}
                >
                  <view>课程：{item.course}</view>
                  <View>
                    时间：
                    {`${item.date} ${item.time} (第 ${item.week} 周 ${item.day})`}
                  </View>
                  <View>地点：{item.place}</View>
                  <View>座位号：{item.seat}</View>
                  <View>教师：{item.teacher}</View>
                  {item.phone && <View>教师电话：{item.phone}</View>}
                  {item.email && <View>教师邮箱：{item.email}</View>}
                  <View></View>
                </DisplayCard>
              )
            })}
            <DisplayCard>
              <View style='text-align: center;'>见底了</View>
            </DisplayCard>
          </View>
        ) : (
          <NoData text='暂时没有实验' />
        )}
      </PullRefresh>
    </Fragment>
  )
}

export default Index
