import request from '../request'

/**
 * GradeItem，成绩
 */
export interface GradeItem {
  courseId: string // 课程代码
  courseName: string // 课程名称
  credit: number // 学分
  gpa: number // 绩点
  score: number // 成绩
  courseType1: string // 课程类别1
  courseType2: string // 课程类别2
  tags: string[]
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
      xq,
    },
  })
}
