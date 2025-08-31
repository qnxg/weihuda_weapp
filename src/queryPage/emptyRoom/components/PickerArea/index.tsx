import { View, Text, Picker, Radio, Image } from '@tarojs/components'
import React from 'react'
import { radio } from '../../config'
import styles from './index.module.scss'
import iconFinger from '@/static/emptyRoom/icon-finger.svg'

import { buildingInfo, semesterWeekNum, weekdayText } from '@/utils/config'
import type { CommonEventFunction } from '@tarojs/components/types/common'

interface Props {
  pickerValue: number[]
  radioValue: number
  setState: any
}

const multiArray = [
  buildingInfo.map(item => item.building),
  Array.from({ length: semesterWeekNum }, (_, i) => `第${i + 1}周`),
  weekdayText.map(item => `星期${item}`),
]

const PickerArea: React.FC<Props> = props => {
  const { pickerValue = [], radioValue = 0, setState } = props
  /**
   * picker的值发生改变
   * @param e
   */
  const pickerChange: CommonEventFunction = (e): void => {
    setState(s => ({
      ...s,
      pickerValue: e.detail.value,
    }))
  }

  /**
   * radio选择事件处理
   * @param e
   */
  const radioChange = (e: number): void => {
    setState(s => ({
      ...s,
      radioValue: e,
    }))
  }

  /**
   * 渲染radio
   */
  const radioArea = radio.map((item, index) => {
    return (
      <View
        className={styles.radioItem}
        key={item.id}
        onClick={(): void => radioChange(index)}
      >
        <View className={styles.radioLeft}>
          <Radio
            color='#328ccb'
            value={item.id}
            checked={radioValue === index}
            className={styles.radios}
          />
          <Text>{item.text[0]}</Text>
        </View>
        <View>{item.text[1]}</View>
      </View>
    )
  })

  return (
    <View className={styles.container}>
      <View>
        <Picker
          mode='multiSelector'
          range={multiArray}
          value={pickerValue}
          onChange={pickerChange}
          className={styles.picker}
        >
          <Image src={iconFinger} className={styles.preIcon} />
          <View className={styles.titles}>选择楼栋、周数、星期</View>
          <Text decode className={styles.pickerText}>
            {`${multiArray[0][pickerValue[0]]}  ${multiArray[1][pickerValue[1]]}  ${multiArray[2][pickerValue[2]]}`}
          </Text>
        </Picker>
      </View>
      <View>
        <View className={styles.radioArea}>
          <Image src={iconFinger} className={styles.preIcon} />
          <View className={styles.titles}>选择课时</View>
          <View className={styles.radioBox}>{radioArea}</View>
        </View>
      </View>
    </View>
  )
}

export default PickerArea
