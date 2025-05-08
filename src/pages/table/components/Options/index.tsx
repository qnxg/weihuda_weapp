import { useAppDispatch, useAppSelector } from '@/utils/hooks/redux'
import { refreshClassTableThunk, saveClassTable } from '@/models/classTable'
import storage from '@/utils/storage/cache'
import { Picker, Switch, Text, View } from '@tarojs/components'
import classNames from 'classnames'
import React from 'react'
import styles from './index.module.scss'

export interface OptionProps {
  showOption: boolean
}

const Options: React.FC<OptionProps> = ({ showOption = false }) => {
  const { semesters, currentSem, weeks, currentWeeks, mode, showOptions } = useAppSelector((state) => state.classTable)

  const dispatch = useAppDispatch()

  /**
   * 隐藏选项
   */
  const onHideOptions = () => {
    dispatch(
      saveClassTable({
        showOptions: false
      })
    )
  }

  /**
   * 选择学期
   * @param e 事件传的参数
   */
  const onSelectXq = (e): void => {
    dispatch(
      saveClassTable({
        currentSem: e.detail.value,
        currentWeeks: 1
      })
    )
    dispatch(refreshClassTableThunk())
  }

  /**
   * 选择星期
   * @param e 事件传的参数
   */
  const onSelectWeek = (e): void => {
    dispatch(
      saveClassTable({
        currentWeeks: parseInt(e.detail.value) + 1
      })
    )
  }

  /**
   * 改变模式
   * @param e 事件传的参数
   */
  const onModeChange = (e): void => {
    storage.setTableMode(e.detail.value)
    dispatch(
      saveClassTable({
        mode: e.detail.value
      })
    )
  }

  const cxHeaderMask = classNames({
    [styles.headerMask]: true,
    [styles.slideDown]: showOptions
  })

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
      style={`display: ${showOption ? 'block' : 'none'}`}
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
            <Text>当前学期：{semesters[currentSem].show}</Text>
          </Picker>
          <Picker
            onChange={onSelectWeek}
            className={styles['container-item']}
            range={weeks}
            value={currentWeeks - 1}
            mode='selector'
          >
            {currentWeeks >= 0 ? (
              <Text>当前周数：--------第{currentWeeks}周----------</Text>
            ) : (
              <Text>当前周数：---距离开学还有{-currentWeeks}周----</Text>
            )}
          </Picker>
          <View className={styles['switch-item']}>
            <View>仅显示本周课程</View>
            <Switch color='#328ccb' className={styles.switch} checked={mode} onChange={onModeChange} />
          </View>
        </View>
      </View>
    </View>
  )
}

export default Options
