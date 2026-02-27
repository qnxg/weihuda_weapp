import { View } from '@tarojs/components'
import classNames from 'classnames'
import dayjs from 'dayjs'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import CardEmpty from '../utils/CardEmpty'
import styles from './index.module.scss'
import { getClassTable } from '@/apis/hdjw/classTable'
import { getCurrentSemesterInfoApi } from '@/apis/semester'
import Card from '@/components/Card'
import CardHeader from '@/components/Card/CardHeader'
import empty from '@/static/empty/no-today-class.svg'
import cardIcon from '@/static/index/icon/today-class.svg'
import { courseTime } from '@/utils/config'
import usePromise from '@/utils/hooks/usePromise'
import type CardProps from '../../CardProps'
import type { CourseInfo } from '@/apis/hdjw/classTable'

interface ClassDisplayProps {
  currentWeek: number
  dayOfTheWeek: number
  classTable: CourseInfo[]
  isToday?: boolean
}

interface FormatData {
  // 开始上课时间
  startTime: string
  // 结束上课时间
  endTime: string
  // 课程名称
  name: string
  // 第几节
  section: string
  // 授课地点
  location: string
  // 颜色，中间的竖条的颜色
  color: string
  // 教师
  teachers: string
  // 显示类型，正常，即将开始，正在进行，已结束
  type?: 'normal' | 'will' | 'doing' | 'end'
}

/** 单个课程列表显示组件 */
const ClassList: React.FC<ClassDisplayProps> = props => {
  const {
    currentWeek = 0,
    dayOfTheWeek = 0,
    classTable,
    isToday = true,
  } = props

  const dayClass = useMemo<CourseInfo[]>(() => {
    if (classTable) {
      // 取出指定日期的课程
      const temp = classTable.filter(item => {
        if (
          item.weeks.includes(currentWeek) &&
          dayOfTheWeek === (item.day === 7 ? 0 : item.day)
        ) {
          return item
        }
      })
      // 进行排序
      temp.sort((x, y) => {
        if (x.time > y.time) {
          return 1
        } else {
          return -1
        }
      })
      return temp
    } else {
      return []
    }
  }, [classTable, currentWeek, dayOfTheWeek])

  const formattedData = useMemo<Array<FormatData>>(() => {
    // 是否已经出现了一次特殊类型，防止同时出现正在进行和即将开始
    let hasSpecial = false
    // 获取课程显示类型（仅对今日有效）
    const getType = (startTime: string, endTime: string) => {
      if (!isToday) {
        return 'normal'
      }
      const start = dayjs(startTime, 'HH:mm')
      const end = dayjs(endTime, 'HH:mm')
      const current = dayjs()
      // 如果是结束时间之后，已结束
      if (current.isAfter(end)) {
        return 'end'
      }
      if (hasSpecial) {
        return 'normal'
      }
      // 如果介于开始时间和结束时间之间，即正在进行
      if (current.isBefore(end) && current.isAfter(start)) {
        hasSpecial = true
        return 'doing'
      }
      // 如果当前时间小于开始时间30分钟之内，即将开始
      const diffOfStart = start.diff(current, 'minute')
      if (diffOfStart <= 30 && diffOfStart >= 0) {
        hasSpecial = true
        return 'will'
      }
      return 'normal'
    }

    if (dayClass.length !== 0) {
      let mergedClass = dayClass.map(item => {
        return { ...item, _endTime: item.time, _show: true }
      })
      // 从后向前枚举，合并
      for (let i = mergedClass.length - 1; i >= 0; i--) {
        const item = mergedClass[i]!
        if (!item._show) {
          continue
        }
        for (let j = i - 1; j >= 0; j--) {
          const preItem = mergedClass[j]!
          if (
            item.courseName === preItem.courseName &&
            item.place === preItem.place &&
            item.time === preItem.time + 1
          ) {
            // 可以合并
            item.time = preItem.time
            preItem._show = false
          } else {
            break
          }
        }
      }
      mergedClass = mergedClass.filter(item => item._show)
      const tempArray: Array<FormatData> = []
      mergedClass.map(item => {
        const startTime = courseTime[item.time]!.startTime
        const endTime = courseTime[item._endTime]!.endTime
        const temp: FormatData = {
          startTime,
          endTime,
          section: `第${item.time}-${item._endTime}节`,
          name: item.courseName,
          location: item.place ?? '无',
          color: item.bgColor!,
          teachers: item.teacher ?? '无',
          type: getType(startTime, endTime),
        }
        tempArray.push(temp)
      })

      return tempArray
    } else {
      return []
    }
  }, [dayClass, isToday])

  return (
    <>
      {formattedData && formattedData.length > 0 ? (
        <View style={{ marginTop: 8 }}>
          {formattedData.map((item, index) => (
            <View
              key={`${item.name}-${index}`}
              className={classNames(styles.outer, styles[item.type!])}
            >
              <View className={styles.leftPart}>
                <View className={styles.startTime}>{item.startTime}</View>
                <View className={styles.endTime}>{item.endTime}</View>
              </View>
              <View className={styles.mainPart}>
                <View className={styles.courseName}>{item.name}</View>
                <View className={styles.courseInfo}>
                  <View className={styles.infoItem}>{item.section}</View>
                  <View className={styles.infoItem}>{item.location}</View>
                  <View className={styles.infoItem}>{item.teachers}</View>
                </View>
              </View>
              {['will', 'doing'].includes(item.type!) && (
                <View className={styles.rightPart}>
                  <View>{item.type === 'will' ? '即将开始' : '正在进行'}</View>
                </View>
              )}
            </View>
          ))}
        </View>
      ) : (
        <CardEmpty
          icon={empty}
          text={
            isToday ? '今日无课，好好放松一下吧' : '明日无课，好好放松一下吧'
          }
        />
      )}
    </>
  )
}

/** 近期课程卡片 - 显示今日和明日课程 */
const RecentClassCard: React.FC<CardProps> = ({
  onLoadingStatusChange,
  reloadController,
}) => {
  const [currentTab, setCurrentTab] = useState(0)

  // 获取学期信息
  const [semesterInfo, isSemesterLoading] = usePromise(
    getCurrentSemesterInfoApi,
    undefined,
    [getCurrentSemesterInfoApi, reloadController]
  )

  // 根据学期信息获取课表
  const fetchClassTable = useCallback(async () => {
    if (!semesterInfo) {
      return []
    }
    const { year, term } = semesterInfo
    return await getClassTable(year.toString(), term)
  }, [semesterInfo])

  const [classTable, isClassTableLoading] = usePromise(
    fetchClassTable,
    [],
    [fetchClassTable, reloadController]
  )

  // 计算今天和明天的日期信息（周次和星期几）
  const { todayInfo, tomorrowInfo } = useMemo(() => {
    if (!semesterInfo) {
      return {
        todayInfo: { week: 0, dayOfWeek: 0 },
        tomorrowInfo: { week: 0, dayOfWeek: 0 },
      }
    }

    const today = dayjs()
    const tomorrow = today.add(1, 'day')
    const semesterStart = dayjs(semesterInfo.startDate)

    // 计算今天是第几周
    const todayWeek = Math.floor(today.diff(semesterStart, 'day') / 7)
    // 计算明天是第几周
    const tomorrowWeek = Math.floor(tomorrow.diff(semesterStart, 'day') / 7)

    return {
      todayInfo: {
        week: todayWeek,
        dayOfWeek: today.day(),
      },
      tomorrowInfo: {
        week: tomorrowWeek,
        dayOfWeek: tomorrow.day(),
      },
    }
  }, [semesterInfo])

  // 更新加载状态
  const loadingStatus = isSemesterLoading || isClassTableLoading
  useEffect(() => {
    onLoadingStatusChange(loadingStatus)
  }, [loadingStatus, onLoadingStatusChange])

  return (
    <Card>
      <CardHeader title='近期课程' icon={cardIcon} />

      {/* Tab 标签 */}
      <View className={styles.tabLabels}>
        <View
          className={classNames(styles.tabLabel, {
            [styles.activeTab]: currentTab === 0,
          })}
          onClick={() => setCurrentTab(0)}
        >
          今日
        </View>
        <View
          className={classNames(styles.tabLabel, {
            [styles.activeTab]: currentTab === 1,
          })}
          onClick={() => setCurrentTab(1)}
        >
          明日
        </View>
      </View>

      {/* 内容区域 - 简单的条件渲染 */}
      <View className={styles.contentContainer}>
        {currentTab === 0 && (
          <ClassList
            currentWeek={todayInfo.week}
            dayOfTheWeek={todayInfo.dayOfWeek}
            classTable={classTable}
            isToday={true}
          />
        )}
        {currentTab === 1 && (
          <ClassList
            currentWeek={tomorrowInfo.week}
            dayOfTheWeek={tomorrowInfo.dayOfWeek}
            classTable={classTable}
            isToday={false}
          />
        )}
      </View>
    </Card>
  )
}

export default RecentClassCard
