import { GradeItem, getGrade } from '@/apis/hdjw/grade'
import PullRefresh from '@/components/PullRefresh'
import TabBar from '@/components/TabBar'
import Tag from '@/components/Tag'
import { useAppSelector } from '@/hooks/redux'
import empty from '@/static/empty/no-grade.svg'
import notStart from '@/static/empty/term-not-start.svg'
import { Image, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import React, { Fragment, useEffect, useMemo, useState } from 'react'
import styles from './index.module.scss'
import { GradeState } from './interface'

const semester = ['秋季学期', '春季学期', '夏季学期']

const Index: React.FC = () => {
  const { termYear, termType } = useAppSelector((state) => state.smester)
  const { enterYear } = useAppSelector((state) => state.userInfo)

  const years = useMemo(() => {
    const yearsArr: number[] = []
    for (let i = 0; enterYear + i <= termYear; ++i) {
      yearsArr.unshift(enterYear + i)
    }
    return yearsArr
  }, [enterYear, termYear])

  const [gradeState, setGradeState] = useState<GradeState>({
    currentSemester: termType,
    currentYear: 0,
    isNotStart: false
  })
  const [data, setData] = useState<GradeItem[]>([])

  const [show, setShow] = useState(false)

  const getData = async () => {
    Taro.showLoading({
      mask: true,
      title: '加载中...'
    })
    try {
      const res = await getGrade(years[gradeState.currentYear], gradeState.currentSemester)
      if (!res || res.length === 0) {
        setShow(false)
      } else {
        console.log(res)
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
    Taro.hideLoading()
  }

  useEffect(() => {
    getData()
  }, [gradeState.currentSemester, gradeState.currentYear])

  const { currentYear, currentSemester, isNotStart } = gradeState

  const onChangeFirstTab = (index: number): void => {
    setGradeState({
      ...gradeState,
      currentYear: index,
      isNotStart: years[index] >= termYear && currentSemester > termType
    })
  }

  const onChangeSecondTab = (index: number): void => {
    setGradeState({
      ...gradeState,
      currentSemester: index + 1,
      isNotStart: years[currentYear] >= termYear && index + 1 > termType
    })
  }

  const onRefresh = async (close) => {
    await getData()
    close()
  }

  return (
    <Fragment>
      <TabBar items={years} num={0} onClick={onChangeFirstTab} current={currentYear} />
      <TabBar items={semester} num={1} onClick={onChangeSecondTab} current={currentSemester - 1} />
      <PullRefresh topGap={136} runFunc={onRefresh}>
        {data && show && data.length > 0 ? (
          data.map((item, i) => {
            return (
              <View key={item.name + i + item.grade} className={styles.gradeCardContainer}>
                <View className={styles.gradeCard}>
                  <View className={styles.nameAndGrade}>
                    <View>{item.name}</View>
                    <View>{item.grade}</View>
                  </View>
                  <View className={styles.exteraInfo}>
                    <View>
                      <Tag>{item.serial}</Tag>
                      <Tag>{item.examType}</Tag>
                    </View>
                    <View>学分：{item.credit}</View>
                  </View>
                </View>
              </View>
            )
          })
        ) : (
          <View className={styles.empty}>
            <Image src={isNotStart ? notStart : empty} className={styles.img} />
            <View className={styles.text}>{isNotStart ? '学期还没有开始哦🤔' : '还没有成绩信息哦😀'}</View>
          </View>
        )}
      </PullRefresh>
    </Fragment>
  )
}

export default Index
