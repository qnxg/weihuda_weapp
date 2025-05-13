import request from '../request'

export interface ExamArrange {
  number: string
  name: string
  classroom: string
  startTime: string
  endTime: string
  seat: string
}

/**
 * 获取机考安排
 * @param xn 学年
 * @param xq 学期
 */
export const getComputerExam = async (xn: string | number = '', xq: string | number = '') => {
  return request.get<any>('/hdjw/exam-arrange', {
    data: {
      xn,
      xq
    }
  })
}
