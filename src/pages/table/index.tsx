import dayjs from 'dayjs'
import React, { Fragment, useEffect, useMemo, useState } from 'react'
import AddCourseButton from './components/AddCourseButton'
import ClassDetailFloat from './components/ClassDetailFloat'
import Header from './components/Header'
import Options from './components/Options'
import TableBody from './components/TableBody'
import PullRefresh from '@/components/PullRefresh'
import {
  initClassTableThunk,
  refreshClassTableThunk,
} from '@/models/classTable'
import { offColor, offFontColor } from '@/utils/config'
import { useAppDispatch, useAppSelector } from '@/utils/hooks/redux'
import type { CurDatesOfWeek, ClassTableItem } from './interface'
import type { CourseInfo } from '@/apis/hdjw/classTable'

const Index: React.FC = () => {
  const cw = useAppSelector(s => s.classTable.currentWeek)
  const [tableCurrentWeek, setTableCurrentWeek] = useState(cw)

  const [
    classDetailsForFloatComponentToShow,
    setClassDetailsForFloatComponentToShow,
  ] = useState<CourseInfo[]>([])
  const clearClassDetailsForFloatComponentToShow = () =>
    setClassDetailsForFloatComponentToShow([])

  const [shouldShowOptions, setShouldShowOptions] = useState(false)

  const { semesters, currentSem, classTable, mode, currentStart } =
    useAppSelector(state => state.classTable)

  const dispatch = useAppDispatch()

  // 初始化
  useEffect(() => {
    if (!semesters || semesters.length === 0) {
      void dispatch(initClassTableThunk())
    }
  }, [dispatch, semesters])

  const onRefresh = async (close: () => void) => {
    await dispatch(refreshClassTableThunk())
    close()
  }

  // 计算当前的月份
  const curMonthOfDay = useMemo<number>(() => {
    if (tableCurrentWeek) {
      const tempWeekNum =
        tableCurrentWeek < 0 ? tableCurrentWeek : tableCurrentWeek - 1
      return dayjs(currentStart).add(tempWeekNum, 'week').month() + 1
    } else {
      return 1
    }
  }, [tableCurrentWeek, currentStart])

  // 计算当前选定周的日期
  const curDatesOfWeek = useMemo<Array<CurDatesOfWeek>>(() => {
    if (tableCurrentWeek) {
      const daysArrayTemp: Array<CurDatesOfWeek> = []
      const curWeek =
        tableCurrentWeek < 0 ? tableCurrentWeek + 1 : tableCurrentWeek - 1
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
  }, [tableCurrentWeek, currentStart])

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
          temp.push({ courses: [], len: 1, merged: false })
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
        if (course.weeks.includes(tableCurrentWeek)) {
          // 是本周的课则放在前面，否则放在后面。这样可以保证本周课程在前面显示
          schedule[course.day]![time]!.courses.unshift(course)
        } else if (!mode) {
          // 没有开启仅显示本周课程
          course.bgColor = offColor
          course.fontColor = offFontColor
          schedule[course.day]![time]!.courses.push(course)
        }
      }
      // 把可以合并的格子都给合并，向上合并
      for (let i = 0; i < 7; ++i) {
        let lastPos = 0
        for (let j = 1; j < 12; ++j) {
          // 判断两个格子是否是本质相同的
          const now = schedule[i]![j]!
          const last = schedule[i]![lastPos]!
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
            schedule[i]![j]!.courses = [] // 清空当前格子，就不会再显示了
            schedule[i]![j]!.merged = true // 标记为被合并
            schedule[i]![lastPos]!.len = last.len + 1
          } else {
            lastPos = j
          }
        }
      }
      return schedule
    } else {
      return []
    }
  }, [classTable, tableCurrentWeek, mode])

  return (
    <Fragment>
      <Header
        curMonthOfDay={curMonthOfDay}
        curDatesOfWeek={curDatesOfWeek}
        tableCurrentWeek={tableCurrentWeek}
        setShouldShowOptions={setShouldShowOptions}
      />
      <PullRefresh runFunc={onRefresh} topGap={124}>
        <TableBody
          formatTable={formatTable}
          tableCurrentWeek={tableCurrentWeek}
          setTableCurrentWeek={setTableCurrentWeek}
          onRefresh={onRefresh}
          setClassDetailsForFloatComponentToShow={
            setClassDetailsForFloatComponentToShow
          }
        />
      </PullRefresh>
      <Options
        show={shouldShowOptions}
        setShow={setShouldShowOptions}
        tableCurrentWeek={tableCurrentWeek}
        setTableCurrentWeek={setTableCurrentWeek}
      />
      <ClassDetailFloat
        classDetailsToShow={classDetailsForFloatComponentToShow}
        clearClassDetailsToShow={clearClassDetailsForFloatComponentToShow}
      />
      <AddCourseButton
        xn={semesters[currentSem]!.xn}
        xq={semesters[currentSem]!.xq}
      />
    </Fragment>
  )
}
export default Index
