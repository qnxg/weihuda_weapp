import { View } from '@tarojs/components'
import classNames from 'classnames'
import dayjs from 'dayjs'
import React, { useEffect, useMemo } from 'react'
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

interface TodayClassProps {
  currentWeek: number
  dayOfTheWeek: number
  classTable: CourseInfo[]
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
  type?: 'normal' | 'will' | 'doing' | 'end'
}

const TodayClassCardDisplay: React.FC<TodayClassProps> = props => {
  const { currentWeek = 0, dayOfTheWeek = 0, classTable } = props

  const todayClass = useMemo<CourseInfo[]>(() => {
    if (classTable) {
      // 取出今日课程
      const temp = classTable.filter(item => {
        if (
          item.weeks.includes(currentWeek) &&
          dayOfTheWeek === (item.day === 7 ? 0 : item.day)
        ) {
          return item
        }
      })
      // 进行排序 注意返回的数据格式不太统一，转化为Int型进行比较
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
    // 获取课程显示类型
    const getType = (startTime: string, endTime: string) => {
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

    if (todayClass.length !== 0) {
      let mergedClass = todayClass.map(item => {
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
          teachers: item.teacher ?? '无',
          type: getType(startTime, endTime),
        }
        tempArray.push(temp)
      })
      return tempArray
    } else {
      return []
    }
  }, [todayClass])

  return (
    <Card>
      <CardHeader title='今日课程' icon={cardIcon} />
      {formattedData && formattedData.length > 0 ? (
        <View style={{ marginTop: 8 }}>
          {formattedData.map(item => (
            <View
              key={item.name}
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
        <CardEmpty icon={empty} text='今日无课，好好放松一下吧' />
      )}
    </Card>
  )
}

/** 今日课程卡片 */
const TodayClassCard: React.FC<CardProps> = ({
  onLoadingStatusChange,
  reloadController,
}) => {
  const [semInfo, loadingSemInfoCache, fetchingSemInfo] =
    useCurrentSemesterInfo([reloadController])
  const { term, year, startDate } = semInfo || {}
  const [course, loadingCourseCache, fetchingCourse] = useCourse(
    year === undefined ? undefined : String(year),
    term === undefined ? undefined : String(term),
    [reloadController]
  )

  // 计算当前周和星期几
  const currentWeek = startDate ? rawWeekNum(startDate) : 0
  const dayOfWeek = new Date().getDay()

  const combinedLoadingStatus =
    loadingSemInfoCache ||
    fetchingSemInfo ||
    loadingCourseCache ||
    fetchingCourse

  // 更新加载状态
  useEffect(() => {
    onLoadingStatusChange(combinedLoadingStatus)
  }, [combinedLoadingStatus, onLoadingStatusChange])

  return (
    <TodayClassCardDisplay
      currentWeek={currentWeek}
      dayOfTheWeek={dayOfWeek}
      classTable={course ?? []}
    />
  )
}

export default TodayClassCard
