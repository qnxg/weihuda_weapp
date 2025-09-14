import { Text, View } from '@tarojs/components'
import classNames from 'classnames'
import React from 'react'
import styles from './index.module.scss'
import { saveClassTable } from '@/models/classTable'
import { useAppDispatch, useAppSelector } from '@/utils/hooks/redux'
import type { CurDatesOfWeek } from '../../interface'

/**
 * @interface Props
 */
interface Props {
  //当前的月份
  curMonthOfDay: number
  //当前周的日期
  curDatesOfWeek: Array<CurDatesOfWeek>
}

const text = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

const Header: React.FC<Props> = props => {
  const { currentWeeks, semesters, currentSem } = useAppSelector(
    state => state.classTable
  )
  const { dayOfWeek, weekNum, termYear, termType } = useAppSelector(
    state => state.semester
  )
  const { curDatesOfWeek = [] } = props

  const dispatch = useAppDispatch()

  /** 显示课表选项 */
  const onShowOptions = () => {
    dispatch(
      saveClassTable({
        showOptions: true,
      })
    )
  }

  return (
    <View>
      <View className={styles['base-info']} onClick={onShowOptions}>
        <View>
          {currentWeeks >= 0 ? (
            <Text decode>
              {semesters[currentSem]!.show}
              &nbsp;&nbsp;&nbsp;&nbsp;第
              {currentWeeks}周
            </Text>
          ) : (
            <Text decode>
              {semesters[currentSem]!.show}
              &nbsp;&nbsp;&nbsp;&nbsp;距离开学还有
              {-currentWeeks}周
            </Text>
          )}
        </View>
        <View className={styles.down} />
      </View>
      <View className={styles.title}>
        {curDatesOfWeek.map((item, index) => {
          const cx = classNames({
            [styles['title-item']]: true,
            [styles.selected]:
              index === dayOfWeek &&
              (currentWeeks < 0 ? currentWeeks + 1 : currentWeeks - 1) ===
                weekNum &&
              semesters[currentSem]!.xn === termYear &&
              semesters[currentSem]!.xq === termType,
          })
          return (
            <View className={cx} key={String(index)}>
              <View>{text[index]}</View>
              <Text className={styles['date-info']}>
                {item.month}/{item.day}
              </Text>
            </View>
          )
        })}
      </View>
    </View>
  )
}

export default Header
