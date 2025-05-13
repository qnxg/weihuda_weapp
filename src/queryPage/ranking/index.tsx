import { Image, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import React, { useEffect, useState } from 'react'
import Semester from './components/semester'
import Report from './components/total'
import style from './index.module.scss'
import { getGradeRank, getMustGrade } from '@/apis/hdjw/gradeRank'
import PullRefresh from '@/components/PullRefresh'
import empty from '@/static/empty/no-ranking.svg'
import { useAppSelector } from '@/utils/hooks/redux'
import type { GradeRank} from '@/apis/hdjw/gradeRank';

const Index: React.FC = () => {
  const [show, setShow] = useState(false)
  const [data, setData] = useState<GradeRank | null>(null)

  const [newShow, setNewShow] = useState(false)
  const [newData, setNewData] = useState<string[] | null>(null)
  let { termYear, termType} = useAppSelector((state) => state.smester)
  if (termType == 1) {
    termYear -= 1
  }

  /**
   * 获取数据
   */
  const getData = async () => {
    await Taro.showLoading({
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
      setShow(false)
      await Taro.showToast({
        icon: 'none',
        title: err.toString()
      })
    }
    // 不处理报错，因为不是特别重要
    const newRes = await getMustGrade()
    if (!newRes) {
      setNewShow(false)
    } else {
      setNewData(newRes)
      setNewShow(true)
    }
    Taro.hideLoading()
  }

  useEffect(() => {
    void getData()
  }, [])

  const onRefresh = async (close) => {
    await getData()
    close()
  }

  return (
    <PullRefresh runFunc={onRefresh}>
      {data && show ? (
        <View className={style.layout}>
          <Report report={data.total} must={newData} year={termYear} show={newShow}/>
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
