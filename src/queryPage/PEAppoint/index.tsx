import { View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import React, { useEffect, useState } from 'react'
import styles from './index.module.scss'
import { getFitnessAppointApi } from '@/apis/pt/fitness'
import DisplayCard from '@/components/DisplayCard'
import NoData from '@/components/NoData'
import PullRefresh from '@/components/PullRefresh'
import type { FitnessAppointItem } from '@/apis/pt/fitness'

const Index: React.FC = () => {
  const [show, setShow] = useState(false)

  const [data, setData] = useState<FitnessAppointItem[] | null>(null)

  /**
   * 获取数据
   */
  const getData = async () => {
    await Taro.showLoading({
      mask: true,
      title: '加载中...',
    })
    try {
      const res = await getFitnessAppointApi()
      if (!res) {
        setShow(false)
      } else {
        setData(res)
        setShow(true)
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

  // const { data, error, loading, run } = useGraphql<RootObject>({
  //   operationName: 'fitness',
  //   query: `
  //     query fitness {
  //       pt {
  //         fitnessAppoint {
  //           appo_desc
  //           appo_time
  //           show_time
  //           test_time
  //           test_type
  //           class_name
  //           status reason
  //         }
  //       }
  //     }
  //     `
  // });

  // useEffect(() => {
  //   if (loading) {
  //     Taro.showLoading({
  //       title: '加载中...',
  //       mask: true
  //     });
  //   } else {
  //     Taro.hideLoading();
  //     if (error) {
  //       Taro.showToast({
  //         icon: 'none',
  //         title: error.toString()
  //       });
  //       setShow(false);
  //     } else if (!data?.data.pt.fitnessAppoint || data?.data.pt.fitnessAppoint.length === 0) {
  //       setShow(false);
  //     } else {
  //       setShow(true);
  //     }
  //   }
  // }, [loading, error, data]);

  const onRefresh = async (close: () => void) => {
    await getData()
    close()
  }

  return (
    <PullRefresh runFunc={onRefresh}>
      {show && data && data.length !== 0 ? (
        <View className={styles.outer}>
          {data.map(item => {
            return (
              <DisplayCard
                title={item.show_time}
                subTitle={item.status}
                key={Math.random()}
              >
                <View>测试地点：{item.class_name}</View>
                <View>测试时间：{item.test_time}</View>
                <View>测试项目：{item.test_type}</View>
                <View>预约说明：{item.appo_desc}</View>
              </DisplayCard>
            )
          })}
        </View>
      ) : (
        <NoData text='暂无体测预约信息' />
      )}
    </PullRefresh>
  )
}

export default Index
