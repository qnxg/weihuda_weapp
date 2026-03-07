import { Text, View } from '@tarojs/components'
import classNames from 'classnames'
import React from 'react'
import styles from './index.module.scss'
import type { CurDatesOfWeek } from '../../interface'
import type { ReactNode } from 'react'

/**
 * @interface Props
 */
interface Props {
  title1: ReactNode
  /** 选定周的日期 */
  tableDatesOfWeek: Array<CurDatesOfWeek> | undefined
  /** 选定周数 */
  tableWeek: number | undefined
  /** 课表选定学年 */
  tableXn: number | undefined
  /** 课表选定学期 */
  tableXq: number | undefined
  /** 当前学年 */
  currentXn: string | undefined
  /** 当前学期 */
  currentXq: string | undefined
  /** 当前周数 */
  currentRawWeekNum: number | undefined
  setShouldShowOptions: React.Dispatch<React.SetStateAction<boolean>>
}

const text = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

const Header: React.FC<Props> = props => {
  const dayOfWeek = new Date().getDay()
  const { tableDatesOfWeek, tableXn, tableXq, currentXn, currentXq } = props

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
              props.tableWeek !== undefined &&
              props.currentRawWeekNum !== undefined &&
              props.tableWeek === props.currentRawWeekNum + 1 &&
              tableXn !== undefined &&
              tableXq !== undefined &&
              tableXn.toString() === currentXn &&
              tableXq.toString() === currentXq,
          })
          const x = tableDatesOfWeek && tableDatesOfWeek[index]
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
