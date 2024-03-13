import { Text, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import React, { useState } from 'react'

import { useAppDispatch } from '@/hooks/redux'
import { saveClassTable } from '@/models/classTable'
import { FormatTable } from '../../interface'
import Day from '../Day'
import styles from './index.module.scss'

/**
 * @interface TableBody Component Props
 */
interface Props {
  formatTable: Array<Array<Array<FormatTable>>>
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
  const onTouchStart = (e) => {
    if (e.touches.length === 1) {
      setStartPos(e.changedTouches[0].pageX)
    }
  }

  /**
   * 触摸结束函数，判断是否切换
   * @param e 事件对象
   */
  const onTouchEnd = (e) => {
    const { currentWeeks } = props
    if (e.changedTouches.length === 1) {
      const end = e.changedTouches[0].pageX
      const offset = end - startPos
      const diffWeek = Math.abs(offset) > 80 ? (offset > 0 ? -1 : 1) : 0
      if (diffWeek !== 0) {
        const finalWeek = currentWeeks < 0 ? 1 : (diffWeek + currentWeeks + 18) % 18
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
      onLongPress={() => {
        Taro.navigateTo({
          url: '/pages/addCourse/index'
        })
      }}
    >
      <View className={styles['jc-indicator']}>
        <Text className={styles.content}>08:00</Text>
        <Text className={styles.content}>10:00</Text>
        <Text className={styles.content}>14:30</Text>
        <Text className={styles.content}>16:10</Text>
        <Text className={styles.content}>19:00</Text>
      </View>
      {formatTable.map((item, index) => {
        return (
          <View style='flex: 1' key={String(index)}>
            <Day dayCourse={item} />
          </View>
        )
      })}
    </View>
  )
}

export default TableBody
