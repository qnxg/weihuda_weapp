import { GradeRank, getGradeRank, getMustGrade } from '@/apis/hdjw/gradeRank'
import PullRefresh from '@/components/PullRefresh'
import empty from '@/static/empty/no-ranking.svg'
import { Image, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import React, { useEffect, useState } from 'react'
import Semester from './components/semester'
import Report from './components/total'
import style from './index.module.scss'

const Index: React.FC = () => {
  const [show, setShow] = useState(false)
  const [data, setData] = useState<GradeRank | null>(null)

  const [newShow, setNewShow] = useState(false)
  const [newData, setNewData] = useState<number | null>(null)
//   const { termYear } = useAppSelector((state) => state.smester)
  const termYear = 2023

  /**
   * 获取数据
   */
  const getData = async () => {
    Taro.showLoading({
      mask: true,
      title: '加载中...'
    })
    try {
      const res = await getGradeRank()
      if (!res) {
        setShow(false)
      } else {
        setData(res)
        setShow(true)
      }
    } catch (err) {
      Taro.showToast({
        icon: 'none',
        title: err.toString()
      })
      setShow(false)
    }
    // 不处理报错，因为不是特别重要
    const newRes = await getMustGrade(termYear) // 这项数据手动更新
    if (!newRes) {
      setNewShow(false)
    } else {
      setNewData(newRes)
      setNewShow(true)
    }
    Taro.hideLoading()
  }

  useEffect(() => {
    getData()
  }, [])

  const onRefresh = async (close) => {
    await getData()
    close()
  }

  return (
    <PullRefresh runFunc={onRefresh}>
      {data && show ? (
        <View className={style.layout}>
          <Report report={data.total} />
          {/* {newData && newShow ? (
            <View className={style.viewCard}>
              <View className={style.viewText}>{termYear}学年全部必修课程加权平均分：{newData}</View>
            </View>
          ) : null} */}
          <Semester semseter={data.semesters} />
        </View>
      ) : (
        <View className={style.empty}>
          <Image src={empty} className={style.img} />
          <View className={style.text}>暂时还没有成绩排名哦</View>
        </View>
      )}
    </PullRefresh>
  )
}

export default Index
