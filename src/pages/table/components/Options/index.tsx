import { Picker, Text, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classNames from 'classnames'
import React, { useMemo } from 'react'
import styles from './index.module.scss'
import AsyncSwitch from '@/components/AsyncSwitch'
import Button from '@/components/Button'
import { semesterWeekNum } from '@/utils/config'
import usePromise from '@/utils/hooks/usePromise'
import useShowCount from '@/utils/hooks/useShowCount'
import { fetchUserSettings } from '@/utils/storage/userSettings'
import { setNeedDisplayNotCurrentWeekClasses } from '@/utils/storage/userSettings/customAccessors/classtablePageSettings'
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
  refreshTableSettingsTrigger: () => void
}

const DisplayNotCurrentWeekSwitch: React.FC<{
  className: string
  refreshTableSettingsTrigger: () => void
}> = props => {
  const showCnt = useShowCount()
  const [userSettings] = usePromise(fetchUserSettings, undefined, [
    fetchUserSettings,
    showCnt,
  ])
  return (
    <AsyncSwitch
      className={props.className}
      init={{
        disabled: false,
        checked:
          userSettings?.classtablePageSettings.needDisplayNotCurrentWeekClasses,
      }}
      onChange={async e => {
        await setNeedDisplayNotCurrentWeekClasses(e.detail.value)
        props.refreshTableSettingsTrigger()
        const settingsUpdated = await fetchUserSettings()

        return {
          disabled: false,
          checked:
            settingsUpdated.classtablePageSettings
              .needDisplayNotCurrentWeekClasses,
        }
      }}
      reInitDeps={[showCnt]}
    />
  )
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
          <View className={styles.showNotCurrentWeekContainer}>
            <DisplayNotCurrentWeekSwitch
              className={styles.showNotCurrentWeekSwitch}
              refreshTableSettingsTrigger={props.refreshTableSettingsTrigger}
            />
            <Text className={styles.showNotCurrentWeekText}>
              显示非本周课程
            </Text>
          </View>
          <Button
            onClick={() =>
              void Taro.navigateTo({
                url: '/settingsPage/classtablePageSettings/index',
              })
            }
            theme='secondary'
            className={styles.goToClassTableSettingsButton}
          >
            所有课表设置…
          </Button>
        </View>
      </View>
    </View>
  )
}

export default Options
