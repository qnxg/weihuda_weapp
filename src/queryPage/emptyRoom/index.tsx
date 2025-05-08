import { EmptyRoomItem, getEmptyRoom } from '@/apis/hdjw/emptyRoom'
import { useAppSelector } from '@/utils/hooks/redux'
import { multiObject } from '@/utils/config'
import { View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import React, { useState } from 'react'
import PickerArea from './components/PickerArea'
import ResultArea from './components/ResultArea'
import { initFunction } from './config'
import { EmptyRoom, Radio as IRadio } from './interface'

const Index: React.FC = () => {
  /**
   * 获得全局状态, 初始化当前状态
   */
  const { termYear, termType, weekNum, dayOfWeek } = useAppSelector((state) => state.smester)
  const [state, setState] = useState(() => initFunction(weekNum, dayOfWeek))
  const [show, setShow] = useState(false)
  const [highlight, setHighlight] = useState<EmptyRoom>({ name: '', type: '', examSeat: 0, seat: 0 })

  /**
   * 获取课时的选择
   * @param radios 多选框的记录值数组
   */
  const getJc = (radios: Array<IRadio>): string => {
    let ans = ''
    for (const radio of radios) {
      if (radio.checked) {
        ans += radio.id + ','
      }
    }
    return ans
  }

  const [data, setData] = useState<EmptyRoomItem[] | null>(null)

  /**
   * 获取数据
   */
  const getData = async () => {
    Taro.showLoading({
      mask: true,
      title: '加载中...'
    })
    try {
      if (termType === null) throw "null termYear";
      const res = await getEmptyRoom({
        xn: termYear,
        xq: termType,
        week: state.pickerValue[1] + 1,
        day: state.pickerValue[2],
        jc: getJc(state.radioValue),
        buildId: multiObject[state.pickerValue[0]].id
      })
      if (!res) {
        setShow(false)
      } else {
        setData(res)
        setShow(true)
      }
    } catch (err) {
      Taro.showToast({
        icon: 'none',
        title: err.toString()
      })
      setShow(false)
    }
    Taro.hideLoading()
  }

  return (
    <View style={{ paddingBottom: '48rpx' }}>
      <PickerArea setState={setState} pickerValue={state.pickerValue} radioValue={state.radioValue} />
      <ResultArea run={getData} roomList={show && data ? data : []} highlight={highlight} setHighlight={setHighlight} />
    </View>
  )
}

export default Index
