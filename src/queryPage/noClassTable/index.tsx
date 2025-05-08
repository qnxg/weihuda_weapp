import DisplayCard from '@/components/DisplayCard'
import PullRefresh from '@/components/PullRefresh'
import { useAppSelector } from '@/utils/hooks/redux'
import useGraphql from '@/hooks/useGraphql'
import iconNoJK from '@/static/empty/no-exam.svg'
import { Image, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import React, { useEffect, useState } from 'react'
import PickerArea from './components/PickerArea'
import styles from './index.module.scss'
import { RootObject } from './interface'

// TODO: 待重构

const Index: React.FC = () => {
  const { semesters, currentSem } = useAppSelector((state) => state.classTable)
  const [show, setShow] = useState(false)
  const [semester, setSemester] = useState(currentSem)

  const { data, error, loading, run } = useGraphql<RootObject>({
    operationName: 'noclasstable',
    variables: {
      xn: semesters[semester].xn,
      xq: semesters[semester].xq
    },
    query: `
      query noclasstable($xn: Int!, $xq: Int!) {
        hdjw {
          noClasstable(xn: $xn, xq: $xq) {
            classID
            serial
            name
            examType
            className
            teacher
            people
            credit
            school
          }
        }
      }
      `
  })

  useEffect(() => {
    if (loading) {
      Taro.showLoading({
        title: '加载中...',
        mask: true
      })
    } else {
      Taro.hideLoading()
      if (error) {
        Taro.showToast({
          icon: 'none',
          title: error.toString()
        })
        setShow(false)
      } else if (!data?.data.hdjw.noClasstable || data?.data.hdjw.noClasstable.length === 0) {
        setShow(false)
      } else {
        setShow(true)
      }
    }
  }, [loading, error, data])

  const onRefresh = async (close) => {
    await run()
    close()
  }

  return (
    <PullRefresh runFunc={onRefresh}>
      <PickerArea setSemester={setSemester} currentSem={semester} run={run} />
      {show && data?.data?.hdjw.noClasstable.length !== 0 ? (
        <View className={styles.outer}>
          {data?.data?.hdjw?.noClasstable.map((item) => {
            return (
              <DisplayCard title={item.name} subTitle={item.classID} footer={item.serial} key={Math.random()}>
                <View>考核方式：{item.examType}</View>
                <View>授课老师：{item.teacher}</View>
                <View>选课人数：{item.people}</View>
                <View>
                  学分/学时：{item.credit}/{item.school}
                </View>
              </DisplayCard>
            )
          })}
        </View>
      ) : (
        <View className={styles.container}>
          <Image src={iconNoJK} className={styles.iconNoJK} />
          <View className={styles.text}>暂时没有无课表课程</View>
        </View>
      )}
    </PullRefresh>
  )
}

export default Index
