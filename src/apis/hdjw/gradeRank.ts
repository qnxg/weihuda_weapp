import request from '../request'

// 请求 hdjw 的 grade-rank 接口时的 query 参数
export interface HdjwGradeRankForm {
  /**
   * 数据来源，1 为成绩主库，2 为执行方案
   */
  data_source: number
  /**
   * 显示方式，1 为取最大成绩，2 为取初修成绩
   */
  display: number
  /**
   * 课程范围，1 为主修，2 为辅修
   */
  range: number
  /**
   * 学年。为空则取全部学年学期，此时 xq 字段会被忽略
   */
  xn?: number
  /**
   * 学期，1为秋季学期，2为春季学期，3为夏季学期。为空则取当前学年下的全部学期
   */
  xq?: number
}

/**
 * Rank
 */
export interface HdjwRank {
  /**
   * 全部课程，为 null 说明暂无数据
   */
  all: null | HdjwRankDetail
  /**
   * 核心课程，为 null 说明暂无数据
   */
  core: null | HdjwRankDetail
  /**
   * 必修课程，为 null 说明暂无数据
   */
  must: null | HdjwRankDetail
}

/**
 * RankDetail
 */
export interface HdjwRankDetail {
  /**
   * 算数平均成绩
   */
  arithmetic: string
  /**
   * 算数平均成绩排名，格式为 排名/总人数，例如 1/100
   */
  arithmetic_rank: string
  /**
   * 绩点
   */
  gpa: string
  /**
   * 绩点排名，格式为 排名/总人数，例如 1/100
   */
  gpa_rank: string
  /**
   * 加权平均成绩
   */
  weighted: string
  /**
   * 加权平均成绩排名，格式为 排名/总人数，例如 1/100
   */
  weighted_rank: string
}

export interface CaGradeRankDetail {
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

export interface CaGradeRank {
  detail: CaGradeRankDetail
  update_at: string // 数据更新时间
}

/**
 * 从教务系统获取成绩排名
 */
export const getGradeRankFromHdjw = async (data: HdjwGradeRankForm) => {
  return request.get<HdjwRank>('/hdjw/grade-rank', { data })
}

/**
 * 从可信电子凭证获取成绩排名
 */
export const getGradeRankFromCa = async () => {
  return request.get<CaGradeRank>('/hdjw/grade-rank-from-ca')
}

export const refreshCaGradeRank = async () => {
  await request.get('/hdjw/grade-rank-from-ca/refresh')
}
