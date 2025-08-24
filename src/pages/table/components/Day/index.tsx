import { View } from '@tarojs/components'
import classNames from 'classnames'
import React from 'react'
import { useDispatch } from 'react-redux'

import styles from './index.module.scss'
import { ClassTableItem } from '../../interface'
import { cellHeight } from '../../index.config'

/**
 * @interface Day Component Props
 * dayCourse 当天的课程数组
 */
interface Props {
  /** 当天的课程数组 */
  dayCourse: Array<ClassTableItem>
}

const Day: React.FC<Props> = props => {
  const { dayCourse = [] } = props
  const dispatch = useDispatch()
  /**
   * 显示课程的详细信息
   * @param e 当前点击的格子
   */
  const onShowFloat = (e: ClassTableItem): void => {
    dispatch({
      type: 'classTable/save',
      payload: {
        showFloat: true,
        floatData: e.courses,
      },
    })
  }

  return (
    <View className={styles.day}>
      {dayCourse.map((cell, index) => {
        if (cell.merged) return null
        if (cell.courses.length === 0) {
          // 目前的后端设计是把每个节次都单独考虑
          // 但是湖大现在一节课是偶数节次，还不存在第一节次上课但是第二节次又不上课的情况
          // 所以我们对于空白格子，可以合并起来，直接渲染一个长度为 2 倍的大格子
          // 并且根据实践，这样做也能有效抵抗微信小程序的 rpx 精度问题
          if (index % 2 !== 0) return null
          return (
            <View
              className={styles.cell}
              key={String(index)}
              style={`margin-top: ${index * cellHeight}rpx; height: ${2 * cellHeight}rpx;`}
            />
          )
        }
        const cx = classNames({
          [styles.course]: true,
          [styles.mults]: cell.courses.length > 1,
        })
        return (
          <View
            className={styles.cell}
            style={`margin-top: ${index * cellHeight}rpx; height: ${
              cell.len * cellHeight
            }rpx;`}
            key={String(index)}
          >
            <View
              onClick={(): void => onShowFloat(cell)}
              className={classNames(cx, 'font-bold')}
              style={`background: ${cell.courses[0].bgColor}; color: ${cell.courses[0].fontColor}`}
            >
              <View className={styles['course-title']}>
                {cell.courses[0].courseName}
              </View>
              {cell.courses[0].place && (
                <View className={styles['course-location']}>
                  @{cell.courses[0].place}
                </View>
              )}
            </View>
          </View>
        )
      })}
    </View>
  )
}

export default Day
