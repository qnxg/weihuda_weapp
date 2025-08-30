import request from '../request'

// 请求 hdjw 的 grade-rank 接口时的 query 参数
export interface HdjwGradeRankForm {
  year?: number // 学年，如果没有则为全部学年
  term?: number // 学期，如果没有则为全部学期
  course: number // 课程类型，1为全部课程，2为必修，3为核心
  rank: number // 排名类型，1为算数平均分，2为加权平均分，3为绩点
}

export interface HdjwGradeRank {
  score: string // 分数
  rank: string // 排名
}

export interface CaGradeRank {
  all_gpa: string
  all_gpa_rank: string
  all_weighted: string
  all_weighted_rank: string
  all_arithmetic: string
  all_arithmetic_rank: string
  must_gpa: string
  must_weighted: string
  must_arithmetic: string
  core_gpa_rank: string
  core_weighted_rank: string
  core_arithmetic_rank: string
}

/**
 * 从教务系统获取成绩排名
 */
export const getGradeRankFromHdjw = async (data: HdjwGradeRankForm) => {
  return request.get<HdjwGradeRank>('/hdjw/grade-rank', { data })
}

/**
 * 从可信电子凭证获取成绩排名
 */
export const getGradeRankFromCa = async () => {
  return request.get<CaGradeRank>('/hdjw/grade-rank-from-ca')
}
