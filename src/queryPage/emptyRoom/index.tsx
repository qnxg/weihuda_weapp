import { View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import React, { useState } from 'react'
import PickerArea from './components/PickerArea'
import ResultArea from './components/ResultArea'
import { initFunction, radio } from './config'
import { getEmptyRoom } from '@/apis/hdjw/emptyRoom'
import { buildingInfo } from '@/utils/config'
import { useAppSelector } from '@/utils/hooks/redux'
import type { EmptyRoom } from './interface'
import type { EmptyRoomItem } from '@/apis/hdjw/emptyRoom'

const Index: React.FC = () => {
  /**
   * 获得全局状态, 初始化当前状态
   */
  const { termYear, termType, weekNum } = useAppSelector(
    state => state.semester
  )
  const dayOfWeek = new Date().getDay()
  const [state, setState] = useState(() => initFunction(weekNum, dayOfWeek))
  const [show, setShow] = useState(false)
  const [highlight, setHighlight] = useState<EmptyRoom>({
    name: '',
    type: '',
    examSeat: 0,
    seat: 0,
  })

  const [data, setData] = useState<EmptyRoomItem[] | null>(null)

  /**
   * 获取数据
   */
  const getData = async () => {
    await Taro.showLoading({
      mask: true,
      title: '加载中...',
    })
    try {
      if (termType === null) throw 'null termYear'
      const res = await getEmptyRoom({
        xn: termYear,
        xq: termType,
        week: state.pickerValue[1]! + 1,
        day: state.pickerValue[2]!,
        jc: radio[state.radioValue]!.id,
        buildId: buildingInfo[state.pickerValue[0]!]!.id,
      })
      if (!res) {
        setShow(false)
      } else {
        setData(res)
        setShow(true)
      }
    } catch (err) {
      setShow(false)
      await Taro.showToast({
        icon: 'none',
        title: err.toString(),
      })
    } finally {
      Taro.hideLoading()
    }
  }

  return (
    <View style={{ paddingBottom: '48rpx' }}>
      <PickerArea
        setState={setState}
        pickerValue={state.pickerValue}
        radioValue={state.radioValue}
      />
      <ResultArea
        run={getData}
        roomList={show && data ? data : []}
        highlight={highlight}
        setHighlight={setHighlight}
      />
    </View>
  )
}

export default Index
