import { RawGradeItem, getRawGrade } from '@/apis/hdjw/rawGrade'
import DisplayCard from '@/components/DisplayCard'
import PullRefresh from '@/components/PullRefresh'
import TabBar from '@/components/TabBar'
import { useAppSelector } from '@/hooks/redux'
import empty from '@/static/empty/no-grade.svg'
import notStart from '@/static/empty/term-not-start.svg'
import { Image, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import React, { Fragment, useEffect, useMemo, useState } from 'react'
import style from './index.module.scss'
import { State } from './interface'

const semester = ['秋季学期', '春季学期', '夏季学期']

const Index: React.FC = () => {
  const { termYear, termType } = useAppSelector((state) => state.smester)
  const { enterYear } = useAppSelector((state) => state.userInfo)

  const years = useMemo(() => {
    const t: Array<number> = []
    for (let i = 0; enterYear + i <= termYear; ++i) {
      t.unshift(enterYear + i)
    }
    return t
  }, [enterYear, termYear])

  const [state, setState] = useState<State>({
    currentTerm: termType ? termType - 1 : -1,
    currentYear: 0
  })

  const [show, setShow] = useState(false)
  const [isNotStart, setIsNotStart] = useState<boolean>(false)
  const [data, setData] = useState<RawGradeItem[]>([])

  /**
   * 获取数据
   */
  const getData = async () => {
    Taro.showLoading({
      mask: true,
      title: '加载中...'
    })
    try {
      const res = await getRawGrade(years[state.currentYear], state.currentTerm + 1)
      if (!res || res.length === 0) {
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
    Taro.hideLoading()
  }

  useEffect(() => {
    getData()
  }, [state.currentTerm, state.currentYear])

  const { currentYear, currentTerm } = state
  const onChangeFirstTab = (index: number): void => {
    setState({
      ...state,
      currentYear: index
    })
    setIsNotStart(termType === null || years[index] >= termYear && currentTerm + 1 > termType)
  }

  const onChangeSecondTab = (index: number): void => {
    setState({
      ...state,
      currentTerm: index
    })
    setIsNotStart(termType === null || years[currentYear] >= termYear && index + 1 > termType)
  }

  const onRefresh = async (close) => {
    await getData()
    close()
  }

  return (
    <Fragment>
      <TabBar items={years} num={0} onClick={onChangeFirstTab} current={currentYear} />
      <TabBar items={semester} num={1} onClick={onChangeSecondTab} current={currentTerm} />
      <PullRefresh runFunc={onRefresh} topGap={136}>
        {data && show && (
          <View>
            {data.map((item) => {
              return (
                <DisplayCard title={item.name} key={Math.random()}>
                  <View>
                    {item.item.map((gradeItem) => {
                      return (
                        <View key={gradeItem.name}>
                          {gradeItem.name}：{gradeItem.grade}
                        </View>
                      )
                    })}
                  </View>
                </DisplayCard>
              )
            })}
          </View>
        )}
        {!show && (
          <View className={style.empty}>
            <Image src={isNotStart ? notStart : empty} className={style.img} />
            <View className={style.text}>{isNotStart ? '学期还没有开始哦🤔' : '暂时还没有成绩详情哦😀'}</View>
          </View>
        )}
      </PullRefresh>
    </Fragment>
  )
}

export default Index
