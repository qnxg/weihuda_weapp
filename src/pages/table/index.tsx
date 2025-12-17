import Taro from '@tarojs/taro'
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

  // 加载错误弹窗用
  const [loadingError, setLoadingError] = useState(false)

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
      // 初始化数组
      const schedule: ClassTableItem[][] = (() => {
        const temp = []
        for (let i = 0; i < 7; i++) {
          const day = []
          for (let j = 0; j < 12; j++) {
            day.push({ courses: [], len: 1, merged: false })
          }
          temp.push(day)
        }
        return temp
      })()

      // 格式化 Table
      classTable.forEach(item => {
        const course = { ...item }
        const time = course.time - 1 // 因为 time 是从 1 开始的, 而我们数组是从 0 开始的
        course.time = -1 // 为了便于后续合并格子, 这里全都改成 -1
        course.day = course.day % 7

        if (course.weeks.includes(tableCurrentWeek)) {
          // 是本周的课则放在前面, 保证本周课程在前面显示
          schedule[course.day]![time]!.courses.unshift(course)
        } else if (!mode) {
          // 未开启仅显示本周课程
          course.bgColor = offColor
          course.fontColor = offFontColor
          schedule[course.day]![time]!.courses.push(course)
        }
      })

      // 课程数组比对辅助函数
      const isCoursesSame = (a: CourseInfo[], b: CourseInfo[]): boolean => {
        if (a.length !== b.length) return false

        const sortedA = Array.from(a).sort((a, b) =>
          a.courseName.localeCompare(b.courseName)
        )
        const sortedB = Array.from(b).sort((a, b) =>
          a.courseName.localeCompare(b.courseName)
        )

        return sortedA.every((a, index) => {
          const b = sortedB[index]!
          const requiredFields = [
            'courseName',
            'courseId',
            'area',
            'className',
            'teacher',
            'place',
          ] as const

          return requiredFields.every(field => a[field] === b[field])
        })
      }

      // 向上合并相同的课程
      schedule.forEach(day => {
        let prevIndex = 0
        day.forEach((cell, index) => {
          if (index === 0) return // 第一节课不需要和上面合并

          const prevCell = day[prevIndex]!
          let isNeedMerged = false

          // 判断当前显示课程是否相同
          if (cell.courses.length > 0 && prevCell.courses.length > 0) {
            if (mode) {
              // 开启仅显示本周课程, 则仅比较并合并本周课程
              const now = cell.courses.filter(item =>
                item.weeks.includes(tableCurrentWeek)
              )
              const prev = prevCell.courses.filter(item =>
                item.weeks.includes(tableCurrentWeek)
              )

              if (now && prev && isCoursesSame(now, prev)) {
                isNeedMerged = true
              }
            } else {
              // 未开启仅显示本周课程, 需要比较两个格子的所有课程是否相同
              if (
                cell.courses &&
                prevCell.courses &&
                isCoursesSame(cell.courses, prevCell.courses)
              ) {
                isNeedMerged = true
              }
            }
          }

          // 进行合并
          if (isNeedMerged) {
            cell.courses = [] // 清空当前格子, 保证不显示
            cell.merged = true // 标记为被合并
            prevCell.len++
          } else {
            prevIndex = index
          }
        })
      })

      return schedule
    } else {
      return []
    }
  }, [classTable, tableCurrentWeek, mode])

  // 加载失败弹窗
  const currentSemInfo = semesters[currentSem]
  useEffect(() => {
    if (!currentSemInfo && !loadingError) {
      setLoadingError(true)

      void Taro.showModal({
        title: '',
        content: '课表加载失败。',
        confirmText: '重新加载',
        showCancel: false,
        success: () => {
          void dispatch(initClassTableThunk()).finally(() => {
            setLoadingError(false)
          })
        },
      })
    }
  }, [currentSemInfo, dispatch, loadingError])

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
      {semesters[currentSem] && (
        <AddCourseButton
          xn={semesters[currentSem].xn}
          xq={semesters[currentSem].xq}
        />
      )}
    </Fragment>
  )
}
export default Index
