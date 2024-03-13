import request from '@/utils/request'

export interface ExamArrange {
  number: string
  name: string
  classroom: string
  startTime: string
  endTime: string
  seat: string
}

/**
 * 日期类型
 */
export default interface DateType {
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

/**
 * 获取考试安排
 * @param xn 学年
 * @param xq 学期
 */
export const getExamArrange = async (xn: string | number = '', xq: string | number = '') => {
  return request.get<any>('/hdjw/exam-arrange', {
    data: {
      xn,
      xq
    }
  })
}
