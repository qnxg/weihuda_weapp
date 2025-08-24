import { Text, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import React, { useState } from 'react'

import Day from '../Day'
import styles from './index.module.scss'
import { saveClassTable } from '@/models/classTable'
import { useAppDispatch } from '@/utils/hooks/redux'
import { ClassTableItem } from '../../interface'

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
        const finalWeek =
          currentWeeks < 0 ? 1 : (diffWeek + currentWeeks + 18) % 18
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
        void Taro.navigateTo({
          url: '/pages/addCourse/index',
        })
      }}
    >
      <View className={styles['jc-indicator']}>
        <View className={styles.content}>
          <View className='flex h-full items-center'>
            <View className='text-center w-full'>
              <View className='mb-1' style={'font-size: 26rpx'}>
                1
              </View>
              <View style={'font-size: 19rpx'}>08:00</View>
              <View style={'font-size: 19rpx'}>09:40</View>
            </View>
          </View>
        </View>

        <View className={styles.content}>
          <View className='flex h-full items-center'>
            <View className='text-center w-full'>
              <View className='mb-1' style={'font-size: 26rpx'}>
                2
              </View>
              <View style={'font-size: 19rpx'}>10:00</View>
              <View style={'font-size: 19rpx'}>11:40</View>
            </View>
          </View>
        </View>

        <View className={styles.content}>
          <View className='flex h-full items-center'>
            <View className='text-center w-full'>
              <View className='mb-1' style={'font-size: 26rpx'}>
                3
              </View>
              <View style={'font-size: 19rpx'}>14:30</View>
              <View style={'font-size: 19rpx'}>16:00</View>
            </View>
          </View>
        </View>

        <View className={styles.content}>
          <View className='flex h-full items-center'>
            <View className='text-center w-full'>
              <View className='mb-1' style={'font-size: 26rpx'}>
                4
              </View>
              <View style={'font-size: 19rpx'}>16:10</View>
              <View style={'font-size: 19rpx'}>17:40</View>
            </View>
          </View>
        </View>

        <View className={styles.content}>
          <View className='flex h-full items-center'>
            <View className='text-center w-full'>
              <View className='mb-1' style={'font-size: 26rpx'}>
                5
              </View>
              <View style={'font-size: 19rpx'}>19:00</View>
              <View style={'font-size: 19rpx'}>20:40</View>
            </View>
          </View>
        </View>

        <View className={styles.content}>
          <View className='flex h-full items-center'>
            <View className='text-center w-full'>
              <View className='mb-1' style={'font-size: 26rpx'}>
                6
              </View>
              <View style={'font-size: 19rpx'}>20:50</View>
              <View style={'font-size: 19rpx'}>22:20</View>
            </View>
          </View>
        </View>
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
