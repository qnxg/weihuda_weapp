import PullRefresh from '@/components/PullRefresh'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { initClassTableThunk, refreshClassTableThunk } from '@/models/classTable'
import { offColor } from '@/utils/config'
import { judgeOn } from '@/utils/day'
import dayjs from 'dayjs'
import React, { Fragment, useEffect, useMemo } from 'react'
import Float from './components/Float'
import Header from './components/Header'
import Options from './components/Options'
import TableBody from './components/TableBody'
import { CurDatesOfWeek, FormatTable } from './interface'

const Index: React.FC = () => {
  const { semesters, classTable, currentWeeks, mode, currentStart, showFloat, showOptions } = useAppSelector(
    (state) => state.classTable
  )

  const dispatch = useAppDispatch()

  // 初始化
  useEffect(() => {
    if (!semesters || semesters.length === 0) {
      dispatch(initClassTableThunk())
    }
  }, [dispatch, semesters])

  const onRefresh = async (close) => {
    await dispatch(refreshClassTableThunk())
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
          day: temp.date()
        })
      }
      return daysArrayTemp
    } else {
      return []
    }
  }, [currentWeeks, currentStart])

  // 格式化课表
  const formatTable = useMemo((): Array<Array<Array<FormatTable>>> => {
    if (classTable) {
      const schedule: Array<Array<Array<FormatTable>>> = []
      // 初始化数组
      for (let i = 0; i < 7; i++) {
        const temp: Array<Array<FormatTable>> = []
        for (let j = 0; j < 12; j++) {
          temp.push([] as Array<FormatTable>)
        }
        schedule.push(temp)
      }
      // 格式化Table
      for (let i = 0; i < classTable.length; i++) {
        const course: FormatTable = Object.assign({}, classTable[i])
        course.day = course.day === 7 ? 0 : course.day
        // 计算起止时间
        const section: Array<string> = course.section.split(',')
        const JCFrom: number = parseInt(section[0])
        const JCTo: number = parseInt(section[section.length - 1])
        course.JCFrom = JCFrom
        course.JCTo = JCTo
        course.len = course.JCTo - course.JCFrom + 1
        // 计算是否为本周课程
        if (judgeOn(course.week, currentWeeks)) {
          course.thisWeek = true
          for (let j = JCFrom - 1; j < JCTo; j++) {
            schedule[course.day][j].unshift(Object.assign({}, course))
          }
        } else if (!mode) {
          course.thisWeek = false
          course.bgColor = offColor
          for (let j = JCFrom - 1; j < JCTo; ++j) {
            schedule[course.day][j].unshift(Object.assign({}, course))
          }
        }
      }
      // 计算显示当前周课程
      for (let i = 0; i < 7; ++i) {
        for (let j = 0; j < 12; ++j) {
          if (schedule[i][j].length > 1) {
            for (let k = 0; k < schedule[i][j].length; ++k) {
              const temp = Object.assign({}, schedule[i][j][k])
              if (temp.thisWeek) {
                schedule[i][j].splice(k, 1)
                schedule[i][j].unshift(temp)
                break
              }
            }
          }
        }
        // 解决重叠问题
        for (let j = 0; j < 12; ++j) {
          const cellItems: Array<FormatTable> = schedule[i][j]
          if (cellItems.length) {
            cellItems[0].show = cellItems[0].JCFrom === j + 1
            if (cellItems[0].show && cellItems[0].len && cellItems[0].len > 1) {
              let JCSum = 0
              if (cellItems[0].JCFrom && cellItems[0].JCTo) {
                for (let k = cellItems[0].JCFrom - 1; k < cellItems[0].JCTo; ++k) {
                  JCSum += schedule[i][k].filter((item) => {
                    return item.classname !== cellItems[0].classname
                  }).length
                  if (JCSum > 1) {
                    cellItems[0].showMoreTag = true
                    break
                  }
                }
              }
            }
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
      <PullRefresh runFunc={onRefresh} topGap={124}>
        <TableBody formatTable={formatTable} currentWeeks={currentWeeks} onRefresh={onRefresh} />
      </PullRefresh>
      <Options showOption={showOptions} />
      <Float showFloat={showFloat} />
    </Fragment>
  )
}
export default Index
