import { Image, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import React, { useState } from 'react'
import PickerArea from './components/PickerArea'
import styles from './index.module.scss'
import { getCourseDetail } from '@/apis/hdjw/courseDetail'
import DisplayCard from '@/components/DisplayCard'
import iconNoJK from '@/static/empty/no-exam.svg'
import { useAppSelector } from '@/utils/hooks/redux'

const Index: React.FC = () => {
  const { semesters, currentSem } = useAppSelector((state) => state.classTable)
  const [show, setShow] = useState(false)
  const [semester, setSemester] = useState(currentSem)
  const [searched, setSearched] = useState<boolean>(false)
  const [keyword, setKeyword] = useState('')

  const [data, setData] = useState<any | null>(null)

  /**
   * 获取数据
   */
  const getData = async () => {
    await Taro.showLoading({
      mask: true,
      title: '加载中...'
    })
    try {
      const xn = semesters[semester].xn
      const xq = semesters[semester].xq
      const res = await getCourseDetail(xn, xq, keyword)
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
  }

  return (
    <View>
      <PickerArea setSemester={setSemester} setKeyword={setKeyword} currentSem={semester} />
      <View
        className={styles.button}
        onClick={async () => {
          await getData()
          setSearched(true)
        }}
      >
        搜索
      </View>
      {searched && show && (
        <View className={styles.tips}>
          <View>
            搜索结果数：{Number(data?.data?.hdjw.course.length) > 99 ? '99+' : String(data?.data?.hdjw.course.length)}
          </View>
        </View>
      )}
      {searched && show && data?.data?.hdjw.course.length !== 0 && (
        <View className={styles.outer}>
          {data?.data?.hdjw?.course.map((item) => {
            return (
              <DisplayCard
                title={item.name}
                subTitle={item.classID}
                footer={`${item.serial} - ${item.place}`}
                key={Math.random()}
              >
                <View>授课老师：{item.teacher}</View>
                <View>开课学院：{item.academy}</View>
                <View>上课班级：{item.className}</View>
                <View>考核方式：{item.examType}</View>
                <View>选课人数：{item.people}</View>
                <View>
                  学分/学时：{item.credit}/{item.school}
                </View>
              </DisplayCard>
            )
          })}
        </View>
      )}
      {searched && !show && (
        <View className={styles.container}>
          <Image src={iconNoJK} className={styles.iconNoJK} />
          <View className={styles.text}>没找到相关课程</View>
        </View>
      )}
    </View>
  )
}

export default Index
