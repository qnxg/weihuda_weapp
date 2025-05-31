import request from '../request'

/**
 * 具体数据，请求失败时为null
 *
 * Chart
 */
export interface Chart {
  CoreWeightAvg: number[]
  CoreWeightAvgRank: number[]
  GPA: number[]
  GPARank: number[]
  semester: string[]
  weightAvg: number[]
  weightAvgRank: number[]
}

/**
 * 获取成绩趋势
 */
export const getChart = async () => {
  return request.get<Chart>('/hdjw/chart')
}
