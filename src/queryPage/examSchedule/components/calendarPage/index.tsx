import { View } from '@tarojs/components'
import React, { useState, useMemo } from 'react'
import {
  initialDisplayDate,
  initialHighlight,
  prevBlank,
  nextBlank,
  datesInMonth,
} from '../../util'
import Calendar from '../calendar'
import ExamArrangeItem from '../ExamArrangeItem'
import { Theme1 } from '@/utils/colors'
import type { ExamArrange } from '@/apis/hdjw/examArrange'

interface Props {
  exam: ExamArrange[]
}

const Index: React.FC<Props> = props => {
  /**
   * 当前展示的月份
   * 注意 display 使不包含考试信息的
   */
  const [display, setDisplay] = useState(initialDisplayDate())
  /**
   * 当前高亮的日期
   * 包含highlight当天的考试信息
   */
  const [highlight, setHighlight] = useState(initialHighlight(props.exam))

  const prev = useMemo(() => {
    return prevBlank(display, props.exam)
  }, [display, props.exam])
  const next = useMemo(() => {
    return nextBlank(display, props.exam)
  }, [display, props.exam])
  const vaild = useMemo(() => {
    return datesInMonth(display.year, display.month, props.exam)
  }, [display.year, display.month, props.exam])

  /**
   * 读取数据会有延时，导致考试信息不能及时更新
   * 利用一个变量检测考试信息的更新
   */
  const checkedHighlight = useMemo(() => {
    return initialHighlight(props.exam || [])
  }, [props.exam])

  if (
    checkedHighlight.date == highlight.date &&
    checkedHighlight.day == highlight.day &&
    (checkedHighlight.exams ?? []).length != (highlight.exams ?? []).length
  ) {
    setHighlight(() => checkedHighlight)
  }

  return (
    <View>
      <Calendar
        display={display}
        setDisplay={setDisplay}
        highlight={highlight}
        setHighlight={setHighlight}
        prev={prev}
        next={next}
        valid={vaild}
      />
      <View>
        {highlight.exams &&
          highlight.exams.map((item, index) => {
            return (
              <ExamArrangeItem
                key={item.name}
                data={item}
                lineColor={Theme1[index % Theme1.length]!}
              />
            )
          })}
      </View>
    </View>
  )
}

export default Index
