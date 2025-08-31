import { View } from '@tarojs/components'
import React, { useState } from 'react'

import Day from '../Day'
import styles from './index.module.scss'
import { saveClassTable } from '@/models/classTable'
import { courseTime } from '@/utils/config'
import { useAppDispatch } from '@/utils/hooks/redux'
import type { ClassTableItem } from '../../interface'

/**
 * @interface TableBody Component Props
 */
interface Props {
  formatTable: Array<Array<ClassTableItem>>
  currentWeeks: number
  onRefresh: (close: () => any) => any
}

const TableBody: React.FC<Props> = (props: Props) => {
  const [startPos, setStartPos] = useState(0)
  const dispatch = useAppDispatch()
  /**
   * 记录触摸开始位置
   * @param e 事件对象
   */
  const onTouchStart = e => {
    if (e.touches.length === 1) {
      setStartPos(e.changedTouches[0].pageX)
    }
  }

  /**
   * 触摸结束函数，判断是否切换
   * @param e 事件对象
   */
  const onTouchEnd = e => {
    const { currentWeeks } = props
    if (e.changedTouches.length === 1) {
      const end = e.changedTouches[0].pageX
      const offset = end - startPos
      const diffWeek = Math.abs(offset) > 80 ? (offset > 0 ? -1 : 1) : 0
      if (diffWeek !== 0) {
        let finalWeek = currentWeeks + diffWeek
        if (finalWeek < 1) finalWeek = 18
        else if (finalWeek > 18) finalWeek = 1
        dispatch(saveClassTable({ currentWeeks: finalWeek }))
      }
    }
  }

  const { formatTable = [] } = props

  return (
    <View
      className={styles['body-container']}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <View className={styles['jc-indicator']}>
        {courseTime.map((item, index) => {
          if (index === 0) return null
          return (
            <View className={styles.content} key={item.id}>
              <View className='flex h-full items-center'>
                <View className='text-center w-full'>
                  <View className={styles.number}>{item.id}</View>
                  <View className={styles.time}>{item.startTime}</View>
                  <View className={styles.time}>{item.endTime}</View>
                </View>
              </View>
            </View>
          )
        })}
      </View>
      {formatTable.map((item, index) => {
        return (
          <View
            style='flex: 1;'
            className={styles['table-row']}
            key={String(index)}
          >
            <Day dayCourse={item} />
          </View>
        )
      })}
    </View>
  )
}

export default TableBody
