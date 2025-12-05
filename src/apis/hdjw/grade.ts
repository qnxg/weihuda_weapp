import request from '../request'
import { getCurrentXnXq } from '../semester'

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
  jx0404id: string | null // 用于获取成绩详情
}

/**
 * 获取成绩
 * @param xn 学年
 * @param xq 学期
 */
export const getGradeApi = async (xn: string | number, xq: string | number) => {
  return request.get<GradeItem[]>('/hdjw/grade', {
    data: {
      xn,
      xq,
    },
  })
}

export const getThisSemesterGrade = async (): Promise<GradeItem[]> =>
  await getGradeApi.apply(null, await getCurrentXnXq())

export interface GradeDetailItem {
  name: string // 项目名称
  score: string // 成绩
  percentage: string // 百分比
  _w: number // 用于排序
}
export type GradeDetail = GradeDetailItem[]
export const getGradeDetailApi = async (
  jx0404id: string
): Promise<GradeDetail> => {
  const res: GradeDetail = await request.get<GradeDetail>(
    '/hdjw/grade/detail',
    {
      data: {
        jx0404id,
      },
    }
  )
  // 后端返回的数据是无序的，这里进行排序
  res.forEach(item => {
    if (item.name.includes('平时')) {
      item._w = 1
    } else if (item.name.includes('期中')) {
      item._w = 2
    } else if (item.name.includes('期末')) {
      item._w = 3
    } else {
      item._w = 0
    }
  })
  res.sort((a, b) => {
    if (a._w != b._w) {
      return a._w - b._w
    } else {
      return a.name.localeCompare(b.name)
    }
  })
  return res
}
