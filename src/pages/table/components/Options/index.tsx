import { Picker, Switch, Text, View } from '@tarojs/components'
import classNames from 'classnames'
import React, { useMemo } from 'react'
import styles from './index.module.scss'
import { refreshClassTableThunk, saveClassTable } from '@/models/classTable'
import { semesterWeekNum } from '@/utils/config'
import { useAppDispatch, useAppSelector } from '@/utils/hooks/redux'
import storage from '@/utils/storage/cache'
import type { BaseEventOrig, PickerSelectorProps } from '@tarojs/components';

export interface OptionProps {
  show: boolean
  setShow: React.Dispatch<React.SetStateAction<boolean>>
  tableCurrentWeek: number,
  setTableCurrentWeek: React.Dispatch<React.SetStateAction<number>>,
}

const Options: React.FC<OptionProps> = (props) => {
  const { semesters, currentSem, mode } =
    useAppSelector(state => state.classTable)

  const dispatch = useAppDispatch()

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
  const onSelectXq = (e: BaseEventOrig<PickerSelectorProps.ChangeEventDetail>): void => {
    dispatch(
      saveClassTable({
        currentSem: e.detail.value as number,
      })
    )
    props.setTableCurrentWeek(1) // why?
    void dispatch(refreshClassTableThunk())
  }

  /**
   * 选择星期
   * @param e 事件传的参数
   */
  const onSelectWeek = (e: BaseEventOrig): void => {
    props.setTableCurrentWeek(parseInt(e.detail.value) + 1)
  }

  /**
   * 改变模式
   * @param e 事件传的参数
   */
  const onModeChange = (e: BaseEventOrig): void => {
    storage.setTableMode(e.detail.value)
    dispatch(
      saveClassTable({
        mode: e.detail.value,
      })
    )
  }

  const cxHeaderMask = classNames({
    [styles.headerMask]: true,
    [styles.slideDown]: props.show,
  })

  const weekPeekerRange = useMemo(() => Array.from({ length: semesterWeekNum }, (_, i) => `第${i + 1}周`), [])

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
            range={semesters}
            value={currentSem}
            rangeKey='show'
            mode='selector'
          >
            <Text>当前学期：{semesters[currentSem]!.show}</Text>
          </Picker>
          <Picker
            onChange={onSelectWeek}
            className={styles['container-item']}
            range={weekPeekerRange}
            value={props.tableCurrentWeek - 1}
            mode='selector'
          >
            {props.tableCurrentWeek >= 0 ? (
              <Text>当前周数：--------第{props.tableCurrentWeek}周----------</Text>
            ) : (
              <Text>当前周数：---距离开学还有{-props.tableCurrentWeek}周----</Text>
            )}
          </Picker>
          <View className={styles['switch-item']}>
            <View>仅显示本周课程</View>
            <Switch
              color='#328ccb'
              className={styles.switch}
              checked={mode}
              onChange={onModeChange}
            />
          </View>
        </View>
      </View>
    </View>
  )
}

export default Options
