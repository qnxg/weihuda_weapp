import { View } from '@tarojs/components'
import classNames from 'classnames'
import dayjs from 'dayjs'
import React, { useEffect, useMemo, useState } from 'react'
import CardEmpty from '../utils/CardEmpty'
import styles from './index.module.scss'
import { useCourse } from '@/apis/hdjw/classTable'
import { useCurrentSemesterInfo } from '@/apis/semester'
import Card from '@/components/Card'
import CardHeader from '@/components/Card/CardHeader'
import empty from '@/static/empty/no-today-class.svg'
import cardIcon from '@/static/index/icon/today-class.svg'
import { courseTime } from '@/utils/config'
import { rawWeekNum } from '@/utils/day'
import type CardProps from '../../CardProps'
import type { CourseInfo } from '@/apis/hdjw/classTable'

interface ClassDisplayProps {
  formattedCourseOfDay: readonly FormatData[] | undefined
  isToday: boolean
  error: boolean
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
  // 教师
  teachers: string
  // 显示类型，正常，即将开始，正在进行，已结束
  type: 'normal-today' | 'normal-tomorrow' | 'will' | 'doing' | 'end'
}

function getCourseByDay(
  classTable: readonly CourseInfo[] | undefined,
  currentWeekNotRaw: number,
  dayOfTheWeek: number
): readonly CourseInfo[] | undefined {
  if (classTable === undefined) {
    return undefined
  }
  // 取出指定日期的课程
  return classTable
    .filter(item => {
      if (
        item.weeks.includes(currentWeekNotRaw) &&
        dayOfTheWeek === (item.day === 7 ? 0 : item.day)
      ) {
        return item
      }
    })
    .toSorted((x, y) => x.time - y.time)
}

function formatCourse(
  courseOfDay: readonly CourseInfo[] | undefined,
  isToday: boolean
): readonly FormatData[] | undefined {
  if (courseOfDay === undefined) {
    return undefined
  }

  // 是否已经出现了一次特殊类型，防止同时出现正在进行和即将开始
  let hasSpecial = false
  // 获取课程显示类型（仅对今日有效）
  const getType = (startTime: string, endTime: string) => {
    if (!isToday) {
      return 'normal-tomorrow'
    }
    const start = dayjs(startTime, 'HH:mm')
    const end = dayjs(endTime, 'HH:mm')
    const current = dayjs()
    // 如果是结束时间之后，已结束
    if (current.isAfter(end)) {
      return 'end'
    }
    if (hasSpecial) {
      return 'normal-today'
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
    return 'normal-today'
  }

  if (courseOfDay.length === 0) {
    return []
  }

  let mergedClass = courseOfDay.map(item => {
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
        item.courseId == preItem.courseId &&
        item.customizeId == preItem.customizeId &&
        item.time === preItem.time + 1
      ) {
        // 可以合并
        item.time = preItem.time
        preItem._show = false
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
      teachers: item.teacher ?? '无',
      type: getType(startTime, endTime),
    }
    tempArray.push(temp)
  })

  return tempArray
}

/** 单个课程列表显示组件 */
const ClassList: React.FC<ClassDisplayProps> = props => {
  const { formattedCourseOfDay, isToday, error } = props

  if (formattedCourseOfDay === undefined) {
    return error ? (
      <CardEmpty icon={empty} text={'课表加载失败⚠️'} />
    ) : (
      <CardEmpty icon={empty} text={'课表加载中，请稍候……'} />
    )
  }
  if (formattedCourseOfDay.length === 0) {
    return (
      <CardEmpty
        icon={empty}
        text={isToday ? '今日无课，好好放松一下吧' : '明日无课，好好放松一下吧'}
      />
    )
  }

  return (
    <View style={{ marginTop: 8 }}>
      {formattedCourseOfDay.map((item, index) => (
        <View
          key={`${item.name}-${index}`}
          className={classNames(styles.outer, styles[item.type])}
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
  )
}

const CourseCard: React.FC<CardProps> = ({
  onLoadingStatusChange,
  reloadController,
}) => {
  const [semInfo, loadingSemInfoCache, fetchingSemInfo] =
    useCurrentSemesterInfo([reloadController])
  const { term, year, startDate } = semInfo || {}
  const [course, loadingCourseCache, fetchingCourse, courseErr] = useCourse(
    year === undefined ? undefined : String(year),
    term === undefined ? undefined : String(term),
    [reloadController]
  )

  const combinedLoadingStatus =
    loadingSemInfoCache ||
    fetchingSemInfo ||
    loadingCourseCache ||
    fetchingCourse

  useEffect(() => {
    onLoadingStatusChange(combinedLoadingStatus)
  }, [combinedLoadingStatus, onLoadingStatusChange])

  return (
    <CourseCardDisplay
      currentSemStartDate={startDate}
      course={course}
      error={courseErr !== null}
    />
  )
}

/** 我的课程卡片 - 显示今日和明日课程 */
const CourseCardDisplay: React.FC<{
  currentSemStartDate: string | undefined
  course: readonly CourseInfo[] | undefined
  error: boolean
}> = props => {
  const { currentSemStartDate, course, error } = props

  // 计算当前周和星期几
  const todayWeek = currentSemStartDate
    ? rawWeekNum(currentSemStartDate) + 1
    : 0
  const todayOfWeek = new Date().getDay()
  const tomorrowWeek = currentSemStartDate
    ? rawWeekNum(currentSemStartDate, dayjs().add(1, 'day')) + 1
    : 0
  const tomorrowOfWeek = (new Date().getDay() + 1) % 7

  const todayFormattedCourse = useMemo(
    () => formatCourse(getCourseByDay(course, todayWeek, todayOfWeek), true),
    [course, todayOfWeek, todayWeek]
  )
  const tomorrowFormattedCourse = useMemo(
    () =>
      formatCourse(getCourseByDay(course, tomorrowWeek, tomorrowOfWeek), false),
    [course, tomorrowOfWeek, tomorrowWeek]
  )

  const todayNoClass: boolean =
    todayFormattedCourse !== undefined && todayFormattedCourse.length == 0
  const todayClassAllOver: boolean =
    todayFormattedCourse !== undefined &&
    todayFormattedCourse.values().every(item => item.type === 'end')
  const shouldShowTab =
    currentSemStartDate !== undefined &&
    course !== undefined &&
    tomorrowWeek <= 18 && // 当前未正确处理两日跨学期的情况，因此假期不显示明日课程
    (todayNoClass || todayClassAllOver)
  const shouldShowTodayByDefault =
    currentSemStartDate === undefined ||
    course === undefined ||
    todayNoClass ||
    !todayClassAllOver

  const [currentTab, setCurrentTab] = useState<0 | 1>(0)
  useEffect(() => {
    if (shouldShowTodayByDefault) {
      setCurrentTab(0)
    } else {
      setCurrentTab(1)
    }
  }, [shouldShowTodayByDefault])

  return (
    <Card>
      <CardHeader title='我的课程' icon={cardIcon} />

      {/* Tab 标签 */}
      {shouldShowTab && (
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
      )}

      {/* 内容区域 - 简单的条件渲染 */}
      <View>
        {currentTab === 0 && (
          <ClassList
            isToday={true}
            formattedCourseOfDay={todayFormattedCourse}
            error={error}
          />
        )}
        {currentTab === 1 && (
          <ClassList
            isToday={false}
            formattedCourseOfDay={tomorrowFormattedCourse}
            error={error}
          />
        )}
      </View>
    </Card>
  )
}

export default CourseCard
