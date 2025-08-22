import { View } from '@tarojs/components'
import classNames from 'classnames'
import React from 'react'
import { useDispatch } from 'react-redux'

import styles from './index.module.scss'
import { ClassTableItem } from '../../interface'

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
        const cx = classNames({
          [styles.course]: true,
          [styles.mults]: cell.courses.length > 1,
        })
        return cell.courses.length > 0 ? (
          <View
            onClick={(): void => onShowFloat(cell)}
            key={String(index)}
            className={cx}
            style={`margin-top: ${index * 95 + 5}rpx; background: ${cell.courses[0].bgColor}; height: ${
              cell.len * 95 - 10
            }rpx`}
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
        ) : null
      })}
    </View>
  )
}

export default Day
