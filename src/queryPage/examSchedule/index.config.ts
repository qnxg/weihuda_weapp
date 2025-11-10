import type { ExamArrange } from '@/apis/hdjw/examArrange'

export default {
  navigationBarTitleText: '考试安排',
}

/**
 * 日期类型
 */
export interface DateType {
  year: number
  /**
   * 月份，从 0 开始算起
   */
  month: number
  /**
   * 日
   */
  date: number
  /**
   * 星期，从 0 开始算起
   */
  day: number
  /**
   * 考试信息
   */
  exams?: ExamArrange[]
}
