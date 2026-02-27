import { Text, View } from '@tarojs/components'
import classNames from 'classnames'
import React from 'react'
import styles from './index.module.scss'
import type { Semester } from '../..'
import type { CurDatesOfWeek } from '../../interface'
import type { ReactNode } from 'react'

/**
 * @interface Props
 */
interface Props {
  title1: ReactNode
  /** 学期信息表 */
  semesters: Semester[] | undefined
  /** 选定周的日期 */
  tableCurrentDatesOfWeek: Array<CurDatesOfWeek> | undefined
  /** 选定周数 */
  tableCurrentWeek: number | undefined
  /** 选定学期 */
  tableCurrentSemIdx: number | undefined
  /** 当前学年 */
  xn: number | undefined
  /** 当前学期 */
  xq: number | undefined
  /** 当前周数 */
  rawWeekNum: number | undefined
  setShouldShowOptions: React.Dispatch<React.SetStateAction<boolean>>
}

const text = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

const Header: React.FC<Props> = props => {
  const dayOfWeek = new Date().getDay()
  const { tableCurrentDatesOfWeek, tableCurrentSemIdx, semesters } = props

  /** 显示课表选项 */
  const onShowOptions = () => {
    props.setShouldShowOptions(true)
  }

  return (
    <View>
      <View className={styles['base-info']} onClick={onShowOptions}>
        <View>{props.title1}</View>
        <View className={styles.down} />
      </View>
      <View className={styles.title}>
        {text.map((d, index) => {
          const cx = classNames({
            [styles['title-item']]: true,
            [styles.selected]:
              index === dayOfWeek &&
              props.tableCurrentWeek !== undefined &&
              (props.tableCurrentWeek < 0
                ? props.tableCurrentWeek + 1
                : props.tableCurrentWeek - 1) === props.rawWeekNum &&
              semesters !== undefined &&
              tableCurrentSemIdx !== undefined &&
              semesters[tableCurrentSemIdx]?.xn === props.xn &&
              semesters[tableCurrentSemIdx]?.xq === props.xq,
          })
          const x = tableCurrentDatesOfWeek && tableCurrentDatesOfWeek[index]
          return (
            <View className={cx} key={String(index)}>
              <View>{d}</View>
              {x && (
                <Text className={styles['date-info']}>
                  {x.month}/{x.day}
                </Text>
              )}
            </View>
          )
        })}
      </View>
    </View>
  )
}

export default Header
