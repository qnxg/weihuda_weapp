import Taro from '@tarojs/taro'
import dayjs from 'dayjs'
import { useEffect, useMemo, useState } from 'react'
import { deleteExamNumApi, getExamNumList } from '@/apis/examNum'
import type { ExamId } from './interface'
import type { ExamNumItem } from '@/apis/examNum'

/**
 * 计算天数差
 * @param date
 */
const calcDaysLeft = (date: string): string => {
  const diff = Math.ceil(dayjs(date).diff(dayjs(), 'day', true))
  let result: string
  if (diff === 0) {
    result = '今天'
  } else {
    result = `${Math.abs(diff)}天`
  }
  return result
}

/** @returns [考号数据列表, 刷新考号列表函数] */
export const useExamId = (): [ExamId[], () => any] => {
  const [data, setData] = useState<ExamNumItem[]>([])

  const run = async () => {
    try {
      const res = await getExamNumList()
      setData(res)
    } catch (error) {
      await Taro.showToast({
        icon: 'none',
        title: error.toString(),
      })
    }
  }

  /** 格式化数据 */
  const formatData = useMemo((): ExamId[] => {
    let result: ExamId[] = []
    if (data) {
      result = data.map(item => ({
        examName: item.name,
        examDate: item.date.replace(/-/g, '/'),
        examId: item.num,
        keyId: item.id,
        sub: calcDaysLeft(item.date),
      }))
    }
    return result
  }, [data])

  useEffect(() => {
    void run()
  }, [])

  return [formatData, run]
}

/** @returns [执行删除操作的函数] */
export const useDeleteId = () => {
  const runExamIdDelete = async (deleteId: number) => {
    try {
      await deleteExamNumApi(deleteId)
      await Taro.showToast({
        title: '删除成功',
        duration: 1500,
      })
    } catch (error) {
      await Taro.showToast({
        icon: 'none',
        title: error.toString(),
      })
    }
  }

  const runDelete = async (keyId: number, callback: () => void) => {
    try {
      await runExamIdDelete(keyId)
      callback()
    } catch {}
  }

  return runDelete
}
