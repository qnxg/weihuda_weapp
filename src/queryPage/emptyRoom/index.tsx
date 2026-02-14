import { View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import React, { useCallback, useEffect, useState } from 'react'
import PickerArea from './components/PickerArea'
import ResultArea from './components/ResultArea'
import { radio } from './config'
import { getEmptyRoom } from '@/apis/hdjw/emptyRoom'
import { getCurrentWeekIndex } from '@/apis/semester'
import { buildingInfo } from '@/utils/config'
import usePromise from '@/utils/hooks/usePromise'
import type { PickerStates } from './components/PickerArea'
import type { EmptyRoom } from './interface'
import type { EmptyRoomItem } from '@/apis/hdjw/emptyRoom'

const Index: React.FC = () => {
  const [currentWeekIndex] = usePromise(getCurrentWeekIndex, null, [
    getCurrentWeekIndex,
  ])

  const defaultPickerState = useCallback(
    (): PickerStates => ({
      pickerValue: {
        buildId: 0,
        weekIndex:
          currentWeekIndex === null
            ? 0
            : Math.min(17, Math.max(0, currentWeekIndex)),
        dayOfTheWeek: new Date().getDay(),
      },
      radioValue: [],
    }),
    [currentWeekIndex]
  )

  const [pickerStates, setPickerStates] =
    useState<PickerStates>(defaultPickerState)
  // 当前周数加载完毕之后更新默认取值
  useEffect(() => {
    setPickerStates(defaultPickerState())
  }, [defaultPickerState])

  const [shouldShowRoomList, setShouldShowRoomList] = useState(false)
  const [highlight, setHighlight] = useState<EmptyRoom>({
    name: '',
    type: '',
    examSeat: 0,
    seat: 0,
  })

  const [roomList, setRoomList] = useState<EmptyRoomItem[] | null>(null)

  /**
   * 获取数据
   */
  const getData = async () => {
    if (pickerStates.radioValue.length === 0) {
      await Taro.showToast({ title: '未选择时间段', icon: 'error' })
      return
    }

    await Taro.showLoading({
      mask: true,
      title: '加载中...',
    })
    try {
      const res = await getEmptyRoom({
        week: pickerStates.pickerValue.weekIndex + 1,
        day: pickerStates.pickerValue.dayOfTheWeek,
        jc: pickerStates.radioValue.map(v => radio[v]!.id).join(','),
        buildId: buildingInfo[pickerStates.pickerValue.buildId]!.id,
      })
      if (res === null || res === undefined) {
        setShouldShowRoomList(false)
      } else {
        setRoomList(res)
        setShouldShowRoomList(true)
      }
    } catch (err) {
      setShouldShowRoomList(false)
      await Taro.showToast({
        icon: 'none',
        title: err.toString(),
      })
    } finally {
      Taro.hideLoading()
    }
  }

  const onPickerStatesChange = (
    newStates: React.SetStateAction<PickerStates>
  ) => {
    setPickerStates(newStates)
    // 切换时间后不再显示旧的数据，提示用户重新请求
    setShouldShowRoomList(false)
  }

  return (
    <View style={{ paddingBottom: '48rpx' }}>
      <PickerArea
        setState={onPickerStatesChange}
        pickerValue={pickerStates.pickerValue}
        radioValue={pickerStates.radioValue}
      />
      <ResultArea
        run={getData}
        roomList={roomList !== null ? roomList : []}
        highlight={highlight}
        setHighlight={setHighlight}
        shouldShowResult={shouldShowRoomList}
      />
    </View>
  )
}

export default Index
