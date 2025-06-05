import { View, Image } from '@tarojs/components'
import classnames from 'classnames'
import dayjs from 'dayjs'
import React from 'react'

import { dayTitles, totalCells } from '../../util'
import styles from './index.module.scss'
import shiftLeft from '@/static/calendar/shift-left.svg'
import shiftRight from '@/static/calendar/shift-right.svg'
import type DateType from '@/apis/hdjw/examArrange'

interface Props {
  display
  setDisplay: any
  highlight
  setHighlight: any
  prev: DateType[]
  valid: DateType[]
  next: DateType[]
}

/**
 * 考试日历，日历下附带考试卡片
 * @param props 所有的考试信息
 */
const Index: React.FC<Props> = props => {
  const { display, setDisplay, highlight, setHighlight, prev, next, valid } =
    props

  /** 处理往右翻页 */
  const onRightClick = (): void => {
    let y: number, m: number
    if (display.month === 11) {
      y = display.year + 1
      m = 0
    } else {
      y = display.year
      m = display.month + 1
    }
    setDisplay({
      year: y,
      month: m,
      date: 1,
      day: +dayjs(new Date(y, m, 1)).day(),
    })
  }

  /** 处理往左翻页 */
  const onLeftClick = (): void => {
    let y: number, m: number
    if (display.month === 0) {
      y = display.year - 1
      m = 11
    } else {
      y = display.year
      m = display.month - 1
    }
    setDisplay({
      year: y,
      month: m,
      date: 1,
      day: +dayjs(new Date(y, m, 1)).day(),
    })
  }

  /** 处理点击日期 */
  const onClickCell = (d): void => {
    if (
      d.date !== highlight.date ||
      d.month !== highlight.month ||
      d.year !== highlight.year
    ) {
      if (d.month !== highlight.month) {
        setDisplay({
          year: d.year,
          month: d.month,
          date: d.date,
          day: d.day,
          exams: d.exams,
        })
      }
      setHighlight({
        year: d.year,
        month: d.month,
        date: d.date,
        day: d.day,
        exams: d.exams,
      })
    }
  }

  return (
    <View className={styles.calendar}>
      <View className={styles.headBox}>
        <View className={styles.leftContainer} onClick={onLeftClick}>
          <Image className={styles.shiftLeft} src={shiftLeft} />
        </View>
        <View className={styles.head}>
          {display.month + 1}月 {display.year}
        </View>
        <View className={styles.rightContainer} onClick={onRightClick}>
          <Image className={styles.shiftRight} src={shiftRight} />
        </View>
      </View>

      <View className={styles.title}>
        {dayTitles.map(elm => (
          <View key={elm} className={styles.titleItem}>
            {elm}
          </View>
        ))}
      </View>

      <View className={styles.mainBox}>
        {totalCells(prev, valid, next).map((row, rowIndex) => (
          <View className={styles.row} key={1000 + rowIndex}>
            {row.map((d, index) => (
              <View
                className={styles.cell}
                key={1000 + index}
                onClick={(): void => onClickCell(d)}
              >
                <View
                  className={classnames({
                    [styles.highlight]:
                      d.year === highlight.year &&
                      d.month === highlight.month &&
                      d.date === highlight.date,
                    [styles.valid]:
                      rowIndex * 7 + index >= prev.length &&
                      rowIndex * 7 + index < prev.length + valid.length,
                    [styles.blank]: !(
                      rowIndex * 7 + index >= prev.length &&
                      rowIndex * 7 + index < prev.length + valid.length
                    ),
                  })}
                >
                  {d.date}
                </View>
                {/* 计数圆点 */}
                <View className={styles.counters}>
                  {d.exams !== undefined &&
                    d.exams.map(elm => (
                      <View className={styles.counter} key={elm.name} />
                    ))}
                </View>
              </View>
            ))}
          </View>
        ))}
      </View>
    </View>
  )
}

export default Index
