import React from 'react'
import { CommonEventFunction } from '@tarojs/components/types/common'
import { View, Text, Picker, Image } from '@tarojs/components'
import iconFinger from '@/static/emptyRoom/icon-finger.svg'
import { months } from '@/utils/config'

import styles from './index.module.scss'

interface Props {
  year: string[]
  picker: number[]
  setPicker: any
}

const PickerArea: React.FC<Props> = (props) => {
  const { year, picker, setPicker } = props

  /**
   * picker的值发生改变
   * @param e
   */
  const pickerChange: CommonEventFunction = (e): void => {
    setPicker(e.detail.value as any)
  }

  return (
    <View className={styles.container}>
      <View>
        <Picker
          mode='multiSelector'
          range={[year, months]}
          value={picker}
          onChange={pickerChange}
          className={styles.picker}
        >
          <Image src={iconFinger} className={styles.preIcon} />
          <View className={styles.titles}>选择年份、月份</View>
          <Text decode className={styles.pickerText}>
            {year[picker[0]]}年 - {months[picker[1]]}月
          </Text>
        </Picker>
      </View>
    </View>
  )
}

export default PickerArea
