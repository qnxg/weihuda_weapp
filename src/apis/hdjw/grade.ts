import request from '@/utils/request'

/**
 * GradeItem，成绩
 */
export interface GradeItem {
  /**
   * 开课学院
   */
  college: string
  /**
   * 学分
   */
  credit: number
  /**
   * 考试类型
   */
  examType: string
  /**
   * 成绩
   */
  grade: number
  /**
   * 课程名称
   */
  name: string
  /**
   * 课程编号
   */
  number: string
  /**
   * 课程类型
   */
  serial: string
}

/**
 * 获取成绩
 * @param xn 学年
 * @param xq 学期
 */
export const getGrade = async (xn: string | number, xq: string | number) => {
  return request.get<GradeItem[]>('/hdjw/grade', {
    data: {
      xn,
      xq
    }
  })
}
