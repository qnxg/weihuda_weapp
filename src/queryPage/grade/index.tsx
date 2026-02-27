import { Popup, Cell } from '@taroify/core'
import { Image, View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classNames from 'classnames'
import React, { Fragment, useCallback, useEffect, useState } from 'react'
import styles from './index.module.scss'
import '@/utils/scss/taroify.scss'
import { getGradeApi, getGradeDetailApi } from '@/apis/hdjw/grade'
import { getCurrentXnXq } from '@/apis/semester'
import { getUserInfoApi } from '@/apis/userInfo'
import PullRefresh from '@/components/PullRefresh'
import TabBar from '@/components/TabBar'
import Tag from '@/components/Tag'
import empty from '@/static/empty/no-grade.svg'
import notStart from '@/static/empty/term-not-start.svg'
import usePromise from '@/utils/hooks/usePromise'
import type { GradeState } from './interface'
import type { GradeDetail, GradeItem } from '@/apis/hdjw/grade'

const semester = ['秋季学期', '春季学期', '夏季学期']
const importantType1 = ['必修']
const importantType2 = [
  '专业课',
  '专业基础',
  '学类核心',
  '学门核心',
  '专业核心',
]

const preparePrerequisites = async () => {
  const [[xn, xq], userEnterYear] = await Promise.all([
    getCurrentXnXq(),
    (async () => (await getUserInfoApi()).enter)(),
  ])
  const yearsArr: number[] = []
  for (let i = 0; userEnterYear + i <= xn; ++i) {
    yearsArr.unshift(userEnterYear + i)
  }
  return {
    currentXn: xn,
    currentXq: xq,
    selectableYears: yearsArr,
  }
}

const Index: React.FC = () => {
  const [prerequisites] = usePromise(preparePrerequisites, null, [
    preparePrerequisites,
  ])

  const [
    { selectedXnIndex: selectedXnIdx, selectedXq: selectedXqIdx },
    setSelectedTabStates,
  ] = useState<GradeState>({
    selectedXnIndex: 0,
    selectedXq: 1,
  })
  // 设置默认选项卡
  useEffect(() => {
    if (prerequisites !== null) {
      setSelectedTabStates({
        selectedXnIndex: 0,
        selectedXq: prerequisites.currentXq,
      })
    }
  }, [prerequisites])

  const [data, setData] = useState<GradeItem[]>([])

  const [show, setShow] = useState(false)

  const [showGradeDetail, setShowGradeDetail] = useState<GradeDetail | null>(
    null
  )

  const getData = useCallback(async () => {
    if (prerequisites === null) {
      return
    }
    await Taro.showLoading({
      mask: true,
      title: '加载中...',
    })
    try {
      const res = await getGradeApi(
        prerequisites.selectableYears[selectedXnIdx]!,
        selectedXqIdx
      )
      if (!res || res.length === 0) {
        setShow(false)
      } else {
        console.log(res)
        setData(res)
        setShow(true)
      }
    } catch (err) {
      setShow(false)
      await Taro.showToast({
        icon: 'none',
        title: err.toString(),
      })
    }
    Taro.hideLoading()
  }, [selectedXnIdx, selectedXqIdx, prerequisites])

  useEffect(() => {
    void getData()
  }, [getData])

  const onChangeFirstTab = (index: number): void => {
    setSelectedTabStates({
      selectedXq: selectedXqIdx,
      selectedXnIndex: index,
    })
  }

  const onChangeSecondTab = (index: number): void => {
    setSelectedTabStates({
      selectedXnIndex: selectedXnIdx,
      selectedXq: index + 1,
    })
  }

  const onRefresh = async (close: () => void): Promise<void> => {
    await getData()
    close()
  }

  if (prerequisites === null) {
    console.log('正在加载用户信息和学期信息……')
    return <></>
  }

  const hasSelectedSemesterNotStarted =
    [prerequisites.currentXn, prerequisites.currentXq] <
    [prerequisites.selectableYears[selectedXnIdx]!, selectedXqIdx]

  const getGradeDetail = async (jx0404id: string | null) => {
    if (jx0404id === null) {
      await Taro.showToast({
        icon: 'none',
        title: '暂无成绩详情',
      })
      return
    }
    await Taro.showLoading({
      mask: true,
      title: '加载中...',
    })
    try {
      const res = await getGradeDetailApi(jx0404id)
      setShowGradeDetail(res)
    } catch (err) {
      await Taro.showToast({
        icon: 'none',
        title: err.toString(),
      })
    }
    Taro.hideLoading()
  }

  return (
    <Fragment>
      <Popup
        lock
        open={showGradeDetail !== null}
        onClose={() => setShowGradeDetail(null)}
        placement='bottom'
        rounded
        className={styles.gradeDatalPopup}
      >
        <View className='pt-3'>
          <Text className={styles.title}>分数详情</Text>
        </View>
        {showGradeDetail &&
          showGradeDetail.map((item, index) => (
            <Cell
              key={item.name + index}
              title={item.name}
              brief={item.percentage}
              align='center'
              size='large'
            >
              {item.score}
            </Cell>
          ))}
      </Popup>
      <TabBar
        items={prerequisites.selectableYears}
        num={0}
        onClick={onChangeFirstTab}
        current={selectedXnIdx}
      />
      <TabBar
        items={semester}
        num={1}
        onClick={onChangeSecondTab}
        current={selectedXqIdx - 1}
      />
      <PullRefresh topGap={136} runFunc={onRefresh}>
        {data && show && data.length > 0 ? (
          <Fragment>
            <View className='pt-1'>
              <Text className={styles.tips}>点击可查看课程具体分数组成。</Text>
            </View>
            {data.map((item, i) => {
              return (
                <View
                  key={item.courseName + i}
                  className={styles.gradeCardContainer}
                >
                  <View
                    className={styles.gradeCard}
                    onClick={() => getGradeDetail(item.jx0404id)}
                  >
                    <View className={styles.nameAndGrade}>
                      <View>
                        <View>{item.courseName}</View>
                        <View className={styles.courseID}>{item.courseId}</View>
                      </View>
                      <View>
                        <View className={classNames('inline', styles.score)}>
                          {item.score}
                        </View>
                        <View className={classNames('inline', styles.gpa)}>
                          {' '}
                          / {item.gpa.toFixed(1)}
                        </View>
                      </View>
                    </View>
                    <View className={styles.exteraInfo}>
                      <View>
                        {item.tags.map((tag, idx) => (
                          <Tag key={tag + idx} theme='warning'>
                            {tag}
                          </Tag>
                        ))}
                        {item.courseType1 && (
                          <Tag
                            theme={
                              importantType1.includes(item.courseType1)
                                ? 'primary'
                                : 'default'
                            }
                          >
                            {item.courseType1}
                          </Tag>
                        )}
                        <Tag
                          theme={
                            importantType2.includes(item.courseType2)
                              ? 'primary'
                              : 'default'
                          }
                        >
                          {item.courseType2}
                        </Tag>
                      </View>
                      <View>学分：{item.credit}</View>
                    </View>
                  </View>
                </View>
              )
            })}
          </Fragment>
        ) : (
          <View className={styles.empty}>
            <Image
              src={hasSelectedSemesterNotStarted ? notStart : empty}
              className={styles.img}
            />
            <View className={styles.text}>
              {hasSelectedSemesterNotStarted
                ? '学期还没有开始哦🤔'
                : '还没有成绩信息哦😀'}
            </View>
          </View>
        )}
      </PullRefresh>
    </Fragment>
  )
}

export default Index
