import { Picker, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import React, { useEffect, useMemo, useState } from 'react'
import echarts from './echarts'
import styles from './index.module.scss'
import getOption from './options'
import { getChart } from '@/apis/hdjw/chart'
import EChart from '@/components/Chart'
import PullRefresh from '@/components/PullRefresh'
import type { Chart } from '@/apis/hdjw/chart'

const range = ['全部课程加权平均', '全部课程平均绩点', '核心课程加权平均']

const Index: React.FC = () => {
  const [mode, setMode] = useState(0)
  const [show, setShow] = useState(false)

  const [data, setData] = useState<Chart | undefined>(undefined)

  /**
   * 获取数据
   */
  const getData = async () => {
    await Taro.showLoading({
      mask: true,
      title: '加载中...',
    })
    try {
      const res = await getChart()
      if (!res) {
        setShow(false)
      } else {
        setData(res)
        setShow(true)
      }
    } catch (err) {
      await Taro.showToast({
        icon: 'none',
        title: err.toString(),
      })
      setShow(false)
    }
    Taro.hideLoading()
  }

  useEffect(() => {
    void getData()
  }, [])

  const onRefresh = async close => {
    await getData()
    close()
  }

  const options = useMemo(() => {
    if (show && data) {
      return getOption(mode, data)
    }
    return {}
  }, [show, data, mode])

  return (
    <PullRefresh runFunc={onRefresh}>
      <View className={styles.container}>
        <View className={styles.title}>
          <Picker
            mode='selector'
            range={range}
            value={mode}
            onChange={(e): void => {
              setMode(+e.detail.value)
            }}
            className={styles.down}
          >
            {range[mode]}
          </Picker>
          <View className={styles.subTitle}>点击查看详情</View>
        </View>
        <View
          style={{
            width: '592rpx',
            height: '416rpx',
            margin: '0 auto',
          }}
        >
          <EChart echarts={echarts} option={options} />
        </View>
      </View>
    </PullRefresh>
  )
}

export default Index
