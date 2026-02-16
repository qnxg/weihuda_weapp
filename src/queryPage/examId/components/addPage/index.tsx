import { Input, Picker, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import dayjs from 'dayjs'
import React, { useCallback, useState } from 'react'
import styles from './index.module.scss'
import { postExamNumApi } from '@/apis/examNum'
import type { ExamId } from '../../interface'
import type { BaseEventOrig } from '@tarojs/components'

interface AddPageProps {
  cancelHandle?: () => void
  confirmHandle?: () => void
}

const AddPage: React.FC<AddPageProps> = ({ cancelHandle, confirmHandle }) => {
  const [newItem, setNewItem] = useState<ExamId>({
    examDate: dayjs().format('YYYY-MM-DD'),
  } as ExamId)

  const runExamIdAdd = async () => {
    try {
      await postExamNumApi({
        examName: newItem.examName,
        examDate: newItem.examDate.replace(/\//g, '-'),
        examNum: newItem.examId || ' ',
      })
      await Taro.showToast({
        title: '添加成功',
        duration: 1000,
      })
    } catch (error) {
      await Taro.showToast({
        icon: 'none',
        title: error.toString(),
      })
    } finally {
      Taro.hideLoading()
    }
  }

  const editExamName = useCallback((e: BaseEventOrig) => {
    setNewItem(prev => {
      prev.examName = e.detail.value
      return { ...prev }
    })
  }, [])

  const editExamId = useCallback((e: BaseEventOrig) => {
    setNewItem(prev => {
      prev.examId = e.detail.value
      return { ...prev }
    })
  }, [])

  const editExamTime = useCallback((e: BaseEventOrig) => {
    setNewItem(prev => {
      prev.examDate = e.detail.value
      return { ...prev }
    })
  }, [])

  const addExam = async () => {
    let checkResult = true
    if (newItem.examName) {
      const temp = newItem.examName
      if (temp.trim() === '') {
        checkResult = false
      }
    } else {
      checkResult = false
    }
    if (checkResult) {
      await Taro.showLoading({
        title: '添加中',
        mask: true,
      })
      await runExamIdAdd()
      await Taro.hideLoading()
      confirmHandle && confirmHandle()
    } else {
      await Taro.showToast({
        title: '考试名称为必填项',
        icon: 'none',
      })
    }
  }

  return (
    <View>
      <View className={styles.container}>
        <View className={styles.content}>
          <View className={styles.title}>考试</View>
          <Input
            placeholder='未填写'
            onInput={editExamName}
            className={styles.inputArea}
          />
        </View>
        <View className={styles.content}>
          <View className={styles.title}>考号</View>
          <Input
            placeholder='未填写'
            onInput={editExamId}
            className={styles.inputArea}
          />
        </View>
        <View className={styles.content}>
          <View className={styles.title}>时间</View>
          <Picker
            className={styles.inputArea}
            mode='date'
            value={newItem.examDate}
            onChange={editExamTime}
          >
            <View>{newItem.examDate}</View>
          </Picker>
        </View>
      </View>
      <View className={styles.btnContainer}>
        <View className={styles.cancelButton} onClick={cancelHandle}>
          取消
        </View>
        <View className={styles.saveButton} onClick={addExam}>
          保存
        </View>
      </View>
    </View>
  )
}

export default AddPage
