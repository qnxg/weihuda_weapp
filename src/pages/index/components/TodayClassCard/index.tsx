import { Subject } from '@/models/classTable'
import empty from '@/static/empty/no-today-class.svg'
import cardIcon from '@/static/index/icon/today-class.svg'
import { judgeOn } from '@/utils/day'
import { Block, View } from '@tarojs/components'
import React, { useMemo } from 'react'

import { useAppSelector } from '@/hooks/redux'
import CardEmpty from '../CardEmpty'
import CardLayout from '../CardLayout'
import styles from './index.module.scss'

interface TodayClassProps {
  currentWeek: number
  dayOfTheWeek: number
}

interface FormatData {
  id: string
  startTime: string
  endTime: string
  name: string
  section: string
  location: string
  color: string
  teachers: string
}

const startTime = [
  '8:00',
  '8:55',
  '10:00',
  '10:55',
  '14:30',
  '15:15',
  '16:10',
  '16:55',
  '19:00',
  '19:55',
  '20:50',
  '21:35'
]

const endTime = [
  '8:45',
  '9:40',
  '10:45',
  '11:40',
  '15:15',
  '16:00',
  '16:55',
  '17:40',
  '19:45',
  '20:40',
  '21:35',
  '22:20'
]

const TodayClass: React.FC<TodayClassProps> = (props) => {
  const { currentWeek = 0, dayOfTheWeek = 0 } = props

  const { classTable } = useAppSelector((state) => state.classTable)
  const todayClass = useMemo<Subject[]>(() => {
    if (classTable) {
      // 取出今日课程
      const temp = classTable.filter((item) => {
        if (judgeOn(item.week, currentWeek) && dayOfTheWeek === (item.day === 7 ? 0 : item.day)) {
          return item
        }
      })
      // 进行排序 注意返回的数据格式不太统一，转化为Int型进行比较
      temp.sort((x, y) => {
        if (parseInt(x.section.split(',')[0]) > parseInt(y.section.split(',')[0])) {
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
    if (todayClass.length !== 0) {
      const tempArray: Array<FormatData> = []
      todayClass.map((item) => {
        // 去重
        if (tempArray.some((i) => i.id === item.id)) {
          return
        }
        const tempSection: Array<string> = item.section.split(',')
        const temp: FormatData = {
          id: item.id,
          startTime: startTime[parseInt(tempSection[0]) - 1],
          endTime: endTime[parseInt(tempSection[tempSection.length - 1]) - 1],
          section: `第${parseInt(tempSection[0])}-${parseInt(tempSection[tempSection.length - 1])}节`,
          name: item.classname,
          location: item.location,
          color: item.bgColor!,
          teachers: item.teachers
        }
        tempArray.push(temp)
      })



      return tempArray
    } else {
      return []
    }
  }, [todayClass])

  return (
    <CardLayout icon={cardIcon} title='今日课程'>
      {formattedData && formattedData.length > 0 ? (
        <View style={{ padding: '0 8px', width: '100%' }}>
          {formattedData.map((item) => (
            <View key={item.name} className={styles.outer}>
              <View className={styles.leftPart}>
                <View className={styles.startTime}>{item.startTime}</View>
                <View className={styles.endTime}>{item.endTime}</View>
              </View>
              <View className={styles.rightPart}>
                <View className={styles.courseName}>{item.name}</View>
                <View className={styles.courseInfo}>
                  <View className={styles.infoItem}>{item.section}</View>
                  <View className={styles.infoItem}>{item.location}</View>
                  <View className={styles.infoItem}>{item.teachers}</View>
                </View>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <CardEmpty icon={empty} text='今日无课，好好放松一下吧' />
      )}
    </CardLayout>
  )
}

export default TodayClass
