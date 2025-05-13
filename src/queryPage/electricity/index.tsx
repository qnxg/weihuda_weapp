import { Text, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import React, { useEffect, useState } from 'react'
import { getDormitoryApi, getElectricityApi, updateDormitoryApi } from '@/apis/electricity'
import DisplayCard from '@/components/DisplayCard'
import PullRefresh from '@/components/PullRefresh'
import type { Dormitory} from '@/apis/electricity';

const Index: React.FC = () => {
  const [electricity, setElectricity] = useState<string>()
  const [dormitory, setDormitory] = useState<Dormitory | null>()
  /**
   * 获取数据
   */
  const getData = async (update = false) => {
    await Taro.showLoading({
      mask: true,
      title: '加载中...'
    })
    try {
      if (update) await updateDormitoryApi()
      const res = await getDormitoryApi()
      if (res) {
        setDormitory(res)
        setElectricity(await getElectricityApi(true))
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

  const onRefresh = async (close) => {
    await getData()
    close()
  }

  const updateInfo = async () => {
    await getData(true)
    await Taro.showModal({
      title: '提示',
      content: '已重新更新宿舍信息。如宿舍信息仍无法获取或获取失败，请前往"我的-反馈建议"上报问题。'
    })
  }

  return (
    <PullRefresh runFunc={onRefresh}>
      <DisplayCard title={'当前电量'}>
        <View className={'text-primary'}>
          {dormitory && electricity ? (
            <>
              <Text className={'font-bold text-3xl'}>{electricity.slice(0, -1)}</Text>
              <Text className={'text-xs ml-1'}>{electricity.slice(-1)}</Text>
            </>
          ) : (
            <Text className={'font-bold text-3xl'}>暂无数据</Text>
          )}
        </View>
      </DisplayCard>
      <DisplayCard
        title={'宿舍信息'}
        footer={
          <View className={'text-primary'} onClick={updateInfo}>
            宿舍信息有误？
          </View>
        }
      >
        <View>园区：{dormitory ? dormitory.park : '获取失败'}</View>
        <View>楼栋：{dormitory ? dormitory.build : '获取失败'}</View>
        <View>寝室号：{dormitory ? dormitory.room : '获取失败'}</View>
      </DisplayCard>
    </PullRefresh>
  )
}

export default Index
