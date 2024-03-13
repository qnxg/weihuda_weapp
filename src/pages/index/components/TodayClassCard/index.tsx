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
  startTime: string
  endTime: string
  name: string
  location: string
  color: string
}

const startTime = [
  '8:00 AM',
  '8:55 AM',
  '10:00 AM',
  '10:55 AM',
  '2:30 PM',
  '3:15 PM',
  '4:10 PM',
  '4:55 PM',
  '7:00 PM',
  '7:55 PM',
  '8:50 PM',
  '9:35 PM'
]

const endTime = [
  '8:45 AM',
  '9:40 AM',
  '10:45 AM',
  '11:40 AM',
  '3:15 PM',
  '4:00 PM',
  '4:55 PM',
  '5:40 PM',
  '7:45 PM',
  '8:40 PM',
  '9:35 PM',
  '10:20 PM'
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
        const tempSection: Array<string> = item.section.split(',')
        const temp: FormatData = {
          startTime: startTime[parseInt(tempSection[0]) - 1],
          endTime: endTime[parseInt(tempSection[tempSection.length - 1]) - 1],
          name: item.classname,
          location: item.location,
          color: item.bgColor!
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
        <Block>
          {formattedData.map((item) => (
            <View key={item.name} className={styles.outer}>
              <View className={styles.leftPart}>
                <View className={styles.startTime}>{item.startTime}</View>
                <View className={styles.endTime}>{item.endTime}</View>
              </View>
              <View className={styles.divide} style={{ backgroundColor: item.color }} />
              <View className={styles.rightPart}>
                <View className={styles.courseName}>{item.name}</View>
                <View className={styles.location}>
                  <View className={styles.icon} />
                  <View className={styles.text}>{item.location}</View>
                </View>
              </View>
            </View>
          ))}
        </Block>
      ) : (
        <CardEmpty icon={empty} text='今日无课，好好放松一下吧' />
      )}
    </CardLayout>
  )
}

export default TodayClass
