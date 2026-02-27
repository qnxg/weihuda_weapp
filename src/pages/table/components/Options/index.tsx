import { Picker, Text, View } from '@tarojs/components'
import classNames from 'classnames'
import React, { useMemo } from 'react'
import styles from './index.module.scss'
import { semesterWeekNum } from '@/utils/config'
import type { Semester } from '../..'
import type { BaseEventOrig, PickerSelectorProps } from '@tarojs/components'

export interface OptionProps {
  show: boolean
  setShow: React.Dispatch<React.SetStateAction<boolean>>
  tableCurrentWeek: number | undefined
  setTableCurrentWeek: React.Dispatch<React.SetStateAction<number>>
  tableCurrentSemIdx: number | undefined
  setTableCurrentSem: (newSem: number) => void
  semesters: Semester[] | undefined
}

const Options: React.FC<OptionProps> = props => {
  /**
   * 隐藏选项
   */
  const onHideOptions = () => {
    props.setShow(false)
  }

  /**
   * 选择学期
   * @param e 事件传的参数
   */
  const onSelectXq = (
    e: BaseEventOrig<PickerSelectorProps.ChangeEventDetail>
  ): void => {
    props.setTableCurrentSem(e.detail.value as number)
    props.setTableCurrentWeek(1) // why?
  }

  /**
   * 选择星期
   * @param e 事件传的参数
   */
  const onSelectWeek = (e: BaseEventOrig): void => {
    props.setTableCurrentWeek(parseInt(e.detail.value) + 1)
  }

  const cxHeaderMask = classNames({
    [styles.headerMask]: true,
    [styles.slideDown]: props.show,
  })

  const weekPeekerRange = useMemo(
    () => Array.from({ length: semesterWeekNum }, (_, i) => `第${i + 1}周`),
    []
  )

  return (
    <View
      className={styles.compMask}
      onClick={onHideOptions}
      onTouchStart={(e): void => {
        e.stopPropagation()
      }}
      onTouchMove={(e): void => {
        e.stopPropagation()
      }}
      onTouchEnd={(e): void => {
        e.stopPropagation()
      }}
      style={`display: ${props.show ? 'block' : 'none'}`}
    >
      <View
        className={cxHeaderMask}
        onClick={(e): void => {
          e.stopPropagation()
        }}
      >
        <View className={styles.container}>
          <Picker
            onChange={onSelectXq}
            className={styles['container-item']}
            disabled={props.semesters === undefined}
            range={props.semesters ?? []}
            value={props.semesters ? props.tableCurrentSemIdx : undefined}
            rangeKey='show'
            mode='selector'
          >
            {props.semesters && props.tableCurrentSemIdx !== undefined ? (
              <Text>
                当前学期：
                {props.semesters[props.tableCurrentSemIdx]!.show}
              </Text>
            ) : (
              <Text>学期信息未知</Text>
            )}
          </Picker>
          {props.tableCurrentWeek !== undefined && (
            <Picker
              onChange={onSelectWeek}
              className={styles['container-item']}
              range={weekPeekerRange}
              value={props.tableCurrentWeek - 1}
              mode='selector'
            >
              {props.tableCurrentWeek >= 0 ? (
                <Text>
                  当前周数：--------第{props.tableCurrentWeek}周----------
                </Text>
              ) : (
                <Text>
                  当前周数：---距离开学还有{-props.tableCurrentWeek}周----
                </Text>
              )}
            </Picker>
          )}
        </View>
      </View>
    </View>
  )
}

export default Options
