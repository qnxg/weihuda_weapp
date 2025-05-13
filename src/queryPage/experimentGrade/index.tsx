import { Image, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import React, { Fragment, useCallback, useEffect, useState } from 'react'
import styles from './index.module.scss'
import { LabGradeData, getLabGrade } from '@/apis/pt/labGrade'
import DisplayCard from '@/components/DisplayCard'
import PullRefresh from '@/components/PullRefresh'
import TabBar from '@/components/TabBar'
import empty from '@/static/empty/no-grade.svg'

const Index: React.FC = () => {
  const [show, setShow] = useState(false)
  const [index, setIndex] = useState(0)
  const type = ['物理实验A(1)', '物理实验A(2)']

  const [data, setData] = useState<LabGradeData | null>(null)

  /**
   * 获取数据
   */
  const getData = useCallback(async () => {
    await Taro.showLoading({
      mask: true,
      title: '加载中...'
    })
    try {
      const res = await getLabGrade(index + 1)
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
        title: err.toString()
      })
    } finally {
      Taro.hideLoading()
    }
  }, [index])

  useEffect(() => {
    void getData()
  }, [getData, index])

  const onRefresh = async (close) => {
    await getData()
    close()
  }

  const onChangeFirstTab = (i: number): void => {
    setIndex(i)
  }

  return (
    <Fragment>
      <TabBar items={type} num={0} onClick={onChangeFirstTab} current={index} />
      <PullRefresh runFunc={onRefresh} topGap={68}>
        {data && show && data?.items.length > 0 ? (
          <View style={{ padding: 0 }}>
            <View className={styles.totalAmount}>
              {`已完成学时：${data.total.xs}，课程总评成绩：${data.total.cj}`}
            </View>
            {data.items.map((item) => {
              return (
                <DisplayCard title={item.labname} key={Math.random()} subTitle={`${item.xs} 学时`}>
                  <View>实验总分：{item.grade}</View>
                  <View>
                    预习/考勤：{item.grade_yx} / {item.grade_kq}
                  </View>
                  <view>
                    操作/报告：{item.grade_cz} / {item.grade_bg}
                  </view>
                </DisplayCard>
              )
            })}
            <DisplayCard>
              <View style='text-align: center;'>见底了</View>
            </DisplayCard>
          </View>
        ) : (
          <View className={styles.empty}>
            <Image src={empty} className={styles.img} />
            <View className={styles.text}>暂时没有物理实验成绩</View>
          </View>
        )}
      </PullRefresh>
    </Fragment>
  )
}

export default Index
