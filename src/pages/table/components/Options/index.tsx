import { Picker, Text, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classNames from 'classnames'
import React, { useMemo } from 'react'
import styles from './index.module.scss'
import { useUserInfo } from '@/apis/userInfo'
import AsyncSwitch from '@/components/AsyncSwitch'
import Button from '@/components/Button'
import { semesterWeekNum } from '@/utils/config'
import { getXnXqShowName, rawWeekNum } from '@/utils/day'
import usePromise from '@/utils/hooks/usePromise'
import useShowCount from '@/utils/hooks/useShowCount'
import { fetchUserSettings } from '@/utils/storage/userSettings'
import { setNeedDisplayNotCurrentWeekClasses } from '@/utils/storage/userSettings/customAccessors/classtablePageSettings'
import type { BaseEventOrig, PickerSelectorProps } from '@tarojs/components'

export interface Semester {
  show: string
  xn: number
  xq: number
}

function computeSelectableSemList(
  currentTerm: number,
  currentSemYear: number,
  userEnterYear: number
): Semester[] {
  // 计算学期
  const semesters: Array<Semester> = []
  // TODO 这里先进行特判，到了第三学期就先人为添加一个新学期，
  // 确保能够查看新课表。后续打算大力修改前端
  if (currentTerm === 3) {
    semesters.unshift({
      show: `${currentSemYear + 1}-${currentSemYear + 2}秋`,
      xn: currentSemYear + 1,
      xq: 1,
    })
  }
  // 从当前学年开始倒序枚举到入学年份。有可能入学年份大于当前学年（新生），
  // 此时下界取 min，确保当前学年被加入
  for (
    let i = currentSemYear;
    i >= Math.min(userEnterYear, currentSemYear);
    --i
  ) {
    for (let j = 3; j >= 1; --j) {
      semesters.push({
        show: getXnXqShowName(i, j),
        xn: i,
        xq: j,
      })
    }
  }
  return semesters
}

export interface OptionProps {
  show: boolean
  setShow: React.Dispatch<React.SetStateAction<boolean>>
  tableWeek: number | undefined
  setTableWeek: React.Dispatch<React.SetStateAction<number>>
  tableXn: string | undefined
  tableXq: string | undefined
  setTableXn: (xn: string) => void
  setTableXq: (xq: string) => void
  currentXn: string | undefined
  currentXq: string | undefined
  currentSemStartDate: string | undefined
  refreshTableSettingsTrigger: () => void
  refreshKey: unknown
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
  const {
    tableXn,
    tableXq,
    currentXn,
    currentXq,
    setTableXn,
    setTableXq,
    currentSemStartDate,
    refreshKey,
  } = props
  const [userInfo, , , userInfoErr] = useUserInfo([refreshKey])

  const selectableSemList = useMemo(
    () =>
      currentXn !== undefined &&
      currentXq !== undefined &&
      userInfo !== undefined
        ? computeSelectableSemList(+currentXq, +currentXn, userInfo.enter)
        : undefined,
    [currentXn, currentXq, userInfo]
  )

  const currentIdx = useMemo(
    () =>
      tableXn !== undefined &&
      tableXq !== undefined &&
      selectableSemList !== undefined
        ? selectableSemList.findIndex(
            ({ xn, xq }) => xn === +tableXn && xq === +tableXq
          )
        : undefined,
    [selectableSemList, tableXn, tableXq]
  )

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
    if (selectableSemList === undefined) return
    const { xn, xq } = selectableSemList[e.detail.value as number]!
    setTableXn(xn.toString())
    setTableXq(xq.toString())
    if (
      xn.toString() === currentXn &&
      xq.toString() === currentXq &&
      currentSemStartDate !== undefined
    ) {
      props.setTableWeek(Math.min(18, rawWeekNum(currentSemStartDate) + 1))
    } else {
      props.setTableWeek(1)
    }
  }

  /**
   * 选择星期
   * @param e 事件传的参数
   */
  const onSelectWeek = (e: BaseEventOrig): void => {
    props.setTableWeek(parseInt(e.detail.value) + 1)
  }

  const cxHeaderMask = classNames({
    [styles.headerMask]: true,
    [styles.slideDown]: props.show,
  })

  const weekPeekerRange = useMemo(
    () => Array.from({ length: semesterWeekNum }, (_, i) => `第${i + 1}周`),
    []
  )

  const selectXnXqLabel = () => {
    if (currentIdx !== undefined && selectableSemList !== undefined) {
      return (
        <Text>
          当前学期：
          {selectableSemList[currentIdx]!.show}
        </Text>
      )
    }
    if (userInfoErr) {
      return <Text>用户信息加载失败</Text>
    }
    return <Text>学期信息未知</Text>
  }

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
            disabled={selectableSemList === undefined}
            range={selectableSemList ?? []}
            value={currentIdx}
            rangeKey='show'
            mode='selector'
          >
            {selectXnXqLabel()}
          </Picker>
          {props.tableWeek !== undefined && (
            <Picker
              onChange={onSelectWeek}
              className={styles['container-item']}
              range={weekPeekerRange}
              value={props.tableWeek - 1}
              mode='selector'
            >
              {props.tableWeek >= 0 ? (
                <Text>当前周数：--------第{props.tableWeek}周----------</Text>
              ) : (
                <Text>当前周数：---距离开学还有{-props.tableWeek}周----</Text>
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
