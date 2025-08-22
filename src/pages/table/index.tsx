import dayjs from 'dayjs'
import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import BubbleNotification from './components/FlexTimeBubble'
import Float from './components/Float'
import Header from './components/Header'
import Options from './components/Options'
import TableBody from './components/TableBody'
import { getFlexTimeList } from '@/apis/flexTime'
import PullRefresh from '@/components/PullRefresh'
import {
  initClassTableThunk,
  refreshClassTableThunk,
} from '@/models/classTable'
import { offColor } from '@/utils/config'
import { useAppDispatch, useAppSelector } from '@/utils/hooks/redux'
import type { CurDatesOfWeek, ClassTableItem } from './interface'

const Index: React.FC = () => {
  const {
    semesters,
    classTable,
    currentWeeks,
    mode,
    currentStart,
    showFloat,
    showOptions,
    currentWeek,
  } = useAppSelector(state => state.classTable)
  const { termYear, termType } = useAppSelector(state => state.smester)
  const [showBubble, setShowBubble] = useState(false)
  const [bubbleText, setBubbleText] = useState('')

  const dispatch = useAppDispatch()

  const fetchFlexTimeList = useCallback(async () => {
    const res = await getFlexTimeList()
    if (res && res.length > 0) {
      let day = dayjs().day() as number // 获取今天是星期几
      if (day === 0) {
        day = 7 // 将星期天转换为7
      }
      // 根据今天的周数和星期几来判断是否有调休
      for (const item of res) {
        console.log(currentWeek)
        if (
          item.to.week == currentWeek &&
          item.to.day == day &&
          item.time.xn == termYear &&
          item.time.xq == termType
        ) {
          setShowBubble(true)
          setBubbleText(item.desc)
          break
        }
      }
    }
  }, [currentWeek, termType, termYear])

  useEffect(() => {
    let previousDay = dayjs().day() // 初始化为当前的星期几
    // 定义一个函数来获取调休信息
    // 初次加载时获取调休信息
    void fetchFlexTimeList()
    // 设置一个定时器，每隔一分钟检测 dayjs().day() 是否变化
    const intervalId = setInterval(() => {
      const currentDay = dayjs().day()
      if (currentDay !== previousDay) {
        previousDay = currentDay // 更新 previousDay
        void fetchFlexTimeList() // 重新获取调休信息
      }
    }, 60000) // 每隔一分钟检测一次
    // 清理定时器
    return () => clearInterval(intervalId)
  }, [currentWeek, termYear, termType, fetchFlexTimeList])

  // 初始化
  useEffect(() => {
    if (!semesters || semesters.length === 0) {
      void dispatch(initClassTableThunk())
    }
  }, [dispatch, semesters])

  const onRefresh = async close => {
    await dispatch(refreshClassTableThunk())
    void fetchFlexTimeList()
    close()
  }

  // 计算当前的月份
  const curMonthOfDay = useMemo<number>(() => {
    if (currentWeeks) {
      const tempWeekNum = currentWeeks < 0 ? currentWeeks : currentWeeks - 1
      return dayjs(currentStart).add(tempWeekNum, 'week').month() + 1
    } else {
      return 1
    }
  }, [currentWeeks, currentStart])

  // 计算当前选定周的日期
  const curDatesOfWeek = useMemo<Array<CurDatesOfWeek>>(() => {
    if (currentWeeks) {
      const daysArrayTemp: Array<CurDatesOfWeek> = []
      const curWeek = currentWeeks < 0 ? currentWeeks + 1 : currentWeeks - 1
      const startDate = dayjs(currentStart).add(curWeek, 'week')
      for (let i = 0; i < 7; ++i) {
        const temp = startDate.add(i, 'day')
        daysArrayTemp.push({
          month: temp.month() + 1,
          day: temp.date(),
        })
      }
      return daysArrayTemp
    } else {
      return []
    }
  }, [currentWeeks, currentStart])

  // 格式化课表，我们会处理得到一个 Array<Array<ClassTableItem>> 类型的格式化之后的课表
  // 数组下标的含义为 formatTable[周几][第几节课]
  // 当前周数改变时需要重新计算一个新表
  const formatTable = useMemo((): Array<Array<ClassTableItem>> => {
    if (classTable) {
      const schedule: Array<Array<ClassTableItem>> = []
      // 初始化数组
      for (let i = 0; i < 7; i++) {
        const temp: Array<ClassTableItem> = []
        for (let j = 0; j < 12; j++) {
          temp.push({ courses: [], len: 1 })
        }
        schedule.push(temp)
      }
      // 格式化 Table
      for (let i = 0; i < classTable.length; i++) {
        const course = Object.assign({}, classTable[i]) // classTable 是只读的，需要先复制一下
        const time = course.time - 1 // 因为 time 是从 1 开始的，而我们数组是从 0 开始的
        course.time = -1 // 为了便于后续合并格子，这里全都改成 -1
        course.day = course.day === 7 ? 0 : course.day
        // 计算是否为本周课程
        if (course.weeks.includes(currentWeeks)) {
          // 是本周的课则放在前面，否则放在后面。这样可以保证本周课程在前面显示
          schedule[course.day][time].courses.unshift(course)
        } else if (!mode) {
          // 没有开启仅显示本周课程
          course.bgColor = offColor
          schedule[course.day][time].courses.push(course)
        }
      }
      // 把可以合并的格子都给合并，向上合并
      for (let i = 0; i < 7; ++i) {
        let lastPos = 0
        for (let j = 1; j < 12; ++j) {
          // 判断两个格子是否是本质相同的
          const now = schedule[i][j]
          const last = schedule[i][lastPos]
          let flag = true
          if (
            now.courses.length > 0 &&
            now.courses.length === last.courses.length
          ) {
            // 进行这么复杂比较的原因是可能 courses 的顺序不同
            const tmp: { [index: string]: number } = {}
            for (const item of now.courses) {
              tmp[JSON.stringify(item)] = 1
            }
            for (const item of last.courses) {
              if (tmp[JSON.stringify(item)] === undefined) {
                flag = false
                break
              }
            }
          } else {
            flag = false
          }
          if (flag) {
            schedule[i][j].courses = [] // 清空当前格子，就不会再显示了
            schedule[i][lastPos].len = last.len + 1
          } else {
            lastPos = j
          }
        }
      }
      return schedule
    } else {
      return []
    }
  }, [classTable, currentWeeks, mode])

  return (
    <Fragment>
      <Header curMonthOfDay={curMonthOfDay} curDatesOfWeek={curDatesOfWeek} />
      {showBubble && (
        <BubbleNotification
          content={bubbleText}
          onClose={() => setShowBubble(false)}
        />
      )}
      <PullRefresh runFunc={onRefresh} topGap={124}>
        <TableBody
          formatTable={formatTable}
          currentWeeks={currentWeeks}
          onRefresh={onRefresh}
        />
      </PullRefresh>
      <Options showOption={showOptions} />
      <Float showFloat={showFloat} />
    </Fragment>
  )
}
export default Index
