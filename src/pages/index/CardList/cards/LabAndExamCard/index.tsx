import { View } from '@tarojs/components'
import dayjs from 'dayjs'
import React, { useEffect, useMemo } from 'react'
import CardEmpty from '../utils/CardEmpty'
import TaskItem from './components/TaskItem'
import { getExamNumList } from '@/apis/examNum'
import { getExamArrange } from '@/apis/hdjw/examArrange'
import { getLabArrange } from '@/apis/lab'
import Card from '@/components/Card'
import CardHeader from '@/components/Card/CardHeader'
import empty from '@/static/empty/no-exam.svg'
import cardIcon from '@/static/index/icon/exam-schedule.svg'
import usePromise from '@/utils/hooks/usePromise'
import type { FormatData, TaskItem as TaskItemType } from './types'
import type CardProps from '../../CardProps'

const LabAndExamCardDisplay: React.FC<{ tasks: TaskItemType[] }> = ({
  tasks,
}) => {
  const formattedData = useMemo<Array<FormatData>>(() => {
    const now = dayjs()

    return tasks.map(task => {
      const dayDiff = task.dateTime
        .startOf('day')
        .diff(now.startOf('day'), 'day')
      const hourDiff = task.dateTime.diff(now, 'hour')

      let displayType: 'upcoming' | 'soon' | 'normal' = 'normal'
      let daysText = ''

      if (dayDiff === 0) {
        if (hourDiff <= 2 && hourDiff >= 0) {
          displayType = 'soon'
          daysText = '即将开始'
        } else {
          displayType = 'upcoming'
          daysText = '今天'
        }
      } else if (dayDiff === 1) {
        displayType = 'upcoming'
        daysText = '明天'
      } else if (dayDiff > 0) {
        daysText = `${dayDiff}天后`
      }

      return {
        ...task,
        displayType,
        daysText,
      }
    })
  }, [tasks])

  return (
    <Card>
      <CardHeader title='实验与考试' icon={cardIcon} />
      {formattedData && formattedData.length > 0 ? (
        <View style={{ marginTop: 8 }}>
          {formattedData.map((item, index) => {
            // 根据任务类型组装显示内容
            let title = ''
            const date = item.date
            let time: string | undefined = item.time
            let navigateUrl = ''
            const infoItems: string[] = []

            if (item.type === 'exam') {
              title = `考试 · ${item.name}`
              navigateUrl = '/queryPage/examSchedule/index'
              if (item.location) infoItems.push(item.location)
              if (item.seat) infoItems.push(`座位：${item.seat}`)
            } else if (item.type === 'experiment') {
              title = `实验 · ${item.name}`
              navigateUrl = '/queryPage/experimentArrange/index'
              if (item.location) infoItems.push(item.location)
              if (item.seat) infoItems.push(`座位：${item.seat}`)
              if (item.extra) infoItems.push(item.extra)
            } else if (item.type === 'examId') {
              title = `考试 · ${item.name}（预存）`
              navigateUrl = '/queryPage/examId/index'
              time = undefined
              if (item.examId) infoItems.push(`准考证号：${item.examId}`)
            }

            return (
              <TaskItem
                key={`${item.type}-${item.name}-${index}`}
                displayType={item.displayType}
                date={date}
                time={time}
                title={title}
                infoItems={infoItems}
                daysText={item.daysText}
                navigateUrl={navigateUrl}
              />
            )
          })}
        </View>
      ) : (
        <CardEmpty icon={empty} text='近期暂无考试或实验安排' />
      )}
    </Card>
  )
}

/** 实验与考试卡片 - 显示7天内的考试和实验 */
const LabAndExamCard: React.FC<CardProps> = ({
  onLoadingStatusChange,
  reloadController,
}) => {
  // 获取考试安排
  const [examData, isExamLoading] = usePromise(
    getExamArrange,
    [],
    [getExamArrange, reloadController]
  )

  // 获取实验安排
  const [labData, isLabLoading] = usePromise(getLabArrange, null, [
    getLabArrange,
    reloadController,
  ])

  // 获取准考证预存
  const [examIdData, isExamIdLoading] = usePromise(
    getExamNumList,
    [],
    [getExamNumList, reloadController]
  )

  // 合并和过滤数据，只显示7天内的
  const tasks = useMemo<TaskItemType[]>(() => {
    const now = dayjs()
    const sevenDaysLater = now.add(7, 'day')
    const taskList: TaskItemType[] = []

    // 处理考试数据 - 根据设置决定是否显示
    if (examData && Array.isArray(examData)) {
      examData.forEach(exam => {
        try {
          // 解析日期时间
          const dateTimeStr = `${exam.date} ${exam.time.split('-')[0] || exam.time}`
          const examDateTime = dayjs(dateTimeStr)

          // 只保留7天内且未过期的
          if (
            examDateTime.isValid() &&
            examDateTime.isAfter(now) &&
            examDateTime.isBefore(sevenDaysLater)
          ) {
            taskList.push({
              type: 'exam',
              name: exam.name,
              date: exam.date,
              time: exam.time,
              location: exam.place,
              seat: exam.seat,
              dateTime: examDateTime,
            })
          }
        } catch (e) {
          // 解析失败则跳过
          console.error('Error parsing exam date:', e)
        }
      })
    }

    // 处理实验数据 - 根据设置决定是否显示
    if (labData && Array.isArray(labData)) {
      labData.forEach(lab => {
        try {
          const dateTimeStr = `${lab.date} ${lab.time.split('-')[0] || lab.time}`
          const labDateTime = dayjs(dateTimeStr)

          if (
            labDateTime.isValid() &&
            labDateTime.isAfter(now) &&
            labDateTime.isBefore(sevenDaysLater)
          ) {
            taskList.push({
              type: 'experiment',
              name: lab.name,
              date: lab.date,
              time: lab.time,
              location: lab.place,
              seat: lab.seat,
              dateTime: labDateTime,
              extra: lab.course,
            })
          }
        } catch (e) {
          console.error('Error parsing lab date:', e)
        }
      })
    }

    // 处理准考证预存数据 - 根据设置决定是否显示
    if (examIdData && Array.isArray(examIdData)) {
      examIdData.forEach(examIdItem => {
        try {
          // examIdItem 的 date 格式为 YYYY-MM-DD
          // 假设考试时间为当天上午9点（用于排序）
          const dateTimeStr = `${examIdItem.examDate} 09:00`
          const examIdDateTime = dayjs(dateTimeStr)

          if (
            examIdDateTime.isValid() &&
            examIdDateTime.isAfter(now) &&
            examIdDateTime.isBefore(sevenDaysLater)
          ) {
            taskList.push({
              type: 'examId',
              name: examIdItem.examName,
              date: examIdItem.examDate,
              time: '', // 准考证预存不显示时间
              examId: examIdItem.examNum,
              dateTime: examIdDateTime,
            })
          }
        } catch (e) {
          console.error('Error parsing exam ID date:', e)
        }
      })
    }

    // 按时间排序，由近到远
    taskList.sort((a, b) => {
      if (a.dateTime.isBefore(b.dateTime)) return -1
      if (a.dateTime.isAfter(b.dateTime)) return 1
      return 0
    })

    return taskList
  }, [examData, labData, examIdData])

  // 更新加载状态
  const loadingStatus = isExamLoading || isLabLoading || isExamIdLoading
  useEffect(() => {
    onLoadingStatusChange(loadingStatus)
  }, [loadingStatus, onLoadingStatusChange])

  return <LabAndExamCardDisplay tasks={tasks} />
}

export default LabAndExamCard
