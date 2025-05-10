import request from '../request'

/**
 * GradeRank，成绩排名
 */
export interface GradeRank {
  /**
   * 每个学年的排名信息
   */
  semesters: Semester[]
  /**
   * 总排名
   */
  total: Total
}

interface Semester {
  /**
   * 每个学期的排名信息
   */
  items: Item[]
  year: string
}

interface Item {
  /**
   * 核心课程加权平均分
   */
  coreWeightAvg: string
  /**
   * 核心课程加权平均分排名
   */
  coreWeightAvgRank: string
  /**
   * 平均学分绩点
   */
  GPA: number | number
  /**
   * 平均学分绩点排名
   */
  GPARank: number
  /**
   * 名称
   */
  name: string
  /**
   * 全部课程加权平均分
   */
  weightAvg: number | number
  /**
   * 全部课程加权平均分排名
   */
  weightAvgRank: number
}

/**
 * 总排名
 */
interface Total {
  /**
   * 全部课程算数平均分
   */
  arithmeticAvg: number
  /**
   * 全部课程算数平均分排名
   */
  arithmeticAvgRank: number
  /**
   * 核心课程算数平均分
   */
  coreArithmeticAvg: number
  /**
   * 核心课程算数平均分排名
   */
  coreArithmeticAvgRank: number
  /**
   * 核心课程加权平均分
   */
  coreWeightAvg: number
  /**
   * 核心课程加权平均分排名
   */
  coreWeightAvgRank: number
  /**
   * 平均学分绩点
   */
  GPA: number
  /**
   * 平均学分绩点排名
   */
  GPARank: number
  /**
   * 全部课程加权平均分
   */
  weightAvg: number
  /**
   * 全部课程加权平均分排名
   */
  weightAvgRank: number
}

/**
 * 获取成绩排名
 */
export const getGradeRank = async () => {
  return request.get<GradeRank>('/hdjw/grade-rank')
}

export const getMustGrade = async () => {
  return request.get<string[]>('/hdjw/must-grade')
}