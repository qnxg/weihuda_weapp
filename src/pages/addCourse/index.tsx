import { Input, Picker, View } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import classNames from 'classnames'
import React from 'react'
import useAddCourse from './hooks'
import styles from './index.module.scss'
import { addCoursePicker } from '@/utils/config'
import type {
  BaseEventOrig,
  PickerMultiSelectorProps,
} from '@tarojs/components'

const Index: React.FC = () => {
  const {
    params: { xn: xn_str, xq: xq_str },
  } = useRouter()
  if (xn_str === undefined || xq_str === undefined) {
    throw new Error('bad xn xq router param!!!')
  }
  const xn = parseInt(xn_str, 10)
  const xq = parseInt(xq_str, 10)

  const { state, setState, formatValue, run } = useAddCourse(xn, xq)
  /**
   * 全选全不选
   */
  const selectAll = (): void => {
    setState(s => ({
      ...s,
      week: Array(16).fill(s.mode),
      mode: !s.mode,
    }))
  }
  /**
   * 选择双周
   */
  const handleOdd = (): void => {
    let [...tempSelectWeek] = state.week
    tempSelectWeek = tempSelectWeek.map((_, index) => {
      return index % 2 === 0
    })
    setState(s => ({
      ...s,
      week: tempSelectWeek,
    }))
  }
  /**
   * 选择单周
   */
  const handleDual = (): void => {
    let [...tempSelectWeek] = state.week
    tempSelectWeek = tempSelectWeek.map((_, index) => {
      return index % 2 !== 0
    })
    setState(s => ({
      ...s,
      week: tempSelectWeek,
    }))
  }
  /**
   * 某一列改变进行判断
   * @param e
   */
  const columnChange = (
    e: BaseEventOrig<PickerMultiSelectorProps.ColumnChangeEventDetail>
  ): void => {
    const { column, value } = e.detail
    const [...temp] = state.picker

    temp[column] = value

    // 保证第三列 >= 第二列, 且被修改方始终为主动方
    if (column === 1) {
      if (temp[1] > temp[2]) temp[2] = temp[1]
    } else if (column === 2) {
      if (temp[2] < temp[1]) temp[1] = temp[2]
    }

    setState(s => ({
      ...s,
      picker: temp,
    }))
  }
  /**
   * 设置星期
   * @param e
   */
  const pickerChange = (
    e: BaseEventOrig<PickerMultiSelectorProps.ChangeEventDetail>
  ): void => {
    const [...temp] = state.picker
    temp[0] = e.detail.value[0]
    setState(s => ({
      ...s,
      picker: temp,
    }))
  }
  /**
   * 提交请求
   */
  const submit = (): void => {
    // 开始请求
    const { classname } = state
    const { week, section } = formatValue
    if (classname === '' || section === '' || week === '') {
      void Taro.showToast({
        title: '请检查必填项',
        icon: 'none',
      })
    } else {
      void run()
    }
  }

  return (
    <View className={styles.container}>
      <View className={styles.courseName}>
        <View className={styles.icon} />
        <Input
          className={styles.inputArea}
          placeholder='请在此输入课程名[必填]'
          value={state.classname}
          onInput={(e): void => {
            setState(s => ({ ...s, classname: e.detail.value }))
          }}
        />
      </View>
      <View className={styles.otherData}>
        <View className={styles.dataItem}>
          <View className={styles.itemTitle}>教师</View>
          <View>
            <Input
              placeholder='请在此输入教师名'
              value={state.teachers}
              onInput={(e): void => {
                setState(s => ({
                  ...s,
                  teachers: e.detail.value,
                }))
              }}
            />
          </View>
        </View>
        <View className={styles.dataItem}>
          <View className={styles.itemTitle}>教室</View>
          <View>
            <Input
              placeholder='请在此输入教室'
              value={state.location}
              onInput={(e): void => {
                setState(s => ({
                  ...s,
                  location: e.detail.value,
                }))
              }}
            />
          </View>
        </View>
        <View className={styles.dataItem}>
          <View className={styles.itemTitle}>周次*</View>
          <View>
            <View className={styles.weekContainer}>
              {state.week.map((item, index) => {
                const cx = classNames({
                  [styles.weekItem]: true,
                  [styles.select]: item,
                })
                return (
                  <View
                    key={String(index)}
                    className={cx}
                    onClick={(): void => {
                      const [...temp] = state.week
                      temp[index] = !temp[index]
                      setState(s => ({
                        ...s,
                        week: temp,
                      }))
                    }}
                  >
                    {index + 1}
                  </View>
                )
              })}
            </View>
            <View className={styles.optionContainer}>
              <View className={styles.optionItem} onClick={selectAll}>
                全选/全不选
              </View>
              <View className={styles.optionItem} onClick={handleOdd}>
                单周
              </View>
              <View className={styles.optionItem} onClick={handleDual}>
                双周
              </View>
            </View>
          </View>
        </View>
        <View className={styles.dataItem}>
          <View className={styles.itemTitle}>节次*</View>
          <View className={styles.pickerContainer}>
            <Picker
              range={addCoursePicker}
              value={state.picker}
              mode='multiSelector'
              onColumnChange={columnChange}
              onChange={pickerChange}
            >
              <View>
                {`${addCoursePicker[0]![state.picker[0]]} ${addCoursePicker[1]![state.picker[1]]}-${
                  addCoursePicker[2]![state.picker[2]]
                }`}
              </View>
            </Picker>
          </View>
        </View>
      </View>
      <View className={styles.submit} onClick={submit}>
        添加
      </View>
    </View>
  )
}

export default Index
