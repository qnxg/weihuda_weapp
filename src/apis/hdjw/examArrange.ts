import request from '../request'

export interface ExamArrange {
  id: string
  name: string
  place: string
  date: string
  time: string
  seat: string
}

/**
 * 获取考试安排
 * @param xn 学年
 * @param xq 学期
 */
export const getExamArrange = async (
  xn: string | number = '',
  xq: string | number = ''
) => {
  return request.get<ExamArrange[]>('/hdjw/exam-arrange', {
    data: {
      xn,
      xq,
    },
  })
}
