import type dayjs from 'dayjs'

export interface TaskItem {
  // 任务类型
  type: 'exam' | 'experiment' | 'examId'
  // 任务名称
  name: string
  // 日期
  date: string
  // 时间
  time: string
  // 地点
  location?: string
  // 座位号
  seat?: string
  // 准考证号
  examId?: string
  // 完整日期时间，用于排序
  dateTime: dayjs.Dayjs
  // 其他信息（实验课程名/教师等）
  extra?: string
}

export interface FormatData extends TaskItem {
  // 显示类型
  displayType: 'upcoming' | 'soon' | 'normal'
  // 距离天数文本
  daysText: string
}
