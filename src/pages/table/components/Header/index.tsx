import { useAppDispatch, useAppSelector } from '@/utils/hooks/redux'
import { saveClassTable } from '@/models/classTable'
import { Text, View } from '@tarojs/components'
import classNames from 'classnames'
import React from 'react'
import { CurDatesOfWeek } from '../../interface'
import styles from './index.module.scss'

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

const Header: React.FC<Props> = (props) => {
  const { currentWeeks, semesters, currentSem } = useAppSelector((state) => state.classTable)
  const { dayOfWeek, weekNum, termYear, termType } = useAppSelector((state) => state.smester)
  const { curMonthOfDay = 0, curDatesOfWeek = [] } = props

  const dispatch = useAppDispatch()

  /** 显示课表选项 */
  const onShowOptions = () => {
    dispatch(
      saveClassTable({
        showOptions: true
      })
    )
  }

  return (
    <View>
      <View className={styles['base-info']} onClick={onShowOptions}>
        <View>
          {currentWeeks >= 0 ? (
            <Text decode>
              {semesters[currentSem].show}&nbsp;&nbsp;&nbsp;&nbsp;第{currentWeeks}周
            </Text>
          ) : (
            <Text decode>
              {semesters[currentSem].show}&nbsp;&nbsp;&nbsp;&nbsp;距离开学还有{-currentWeeks}周
            </Text>
          )}
        </View>
        <View className={styles.down} />
      </View>
      <View className={styles.title}>
        <View className={styles['title-item']}>
          <Text>{curMonthOfDay}月</Text>
        </View>
        {curDatesOfWeek.map((item, index) => {
          const cx = classNames({
            [styles['title-item']]: true,
            [styles.selected]:
              index === dayOfWeek &&
              (currentWeeks < 0 ? currentWeeks + 1 : currentWeeks - 1) === weekNum &&
              semesters[currentSem].xn === termYear &&
              semesters[currentSem].xq === termType
          })
          return (
            <View className={cx} key={String(index)}>
              <View>{text[index]}</View>
              {item.day === 1 ? <Text>{item.month}月</Text> : <Text>{item.day}日</Text>}
            </View>
          )
        })}
      </View>
    </View>
  )
}

export default Header
