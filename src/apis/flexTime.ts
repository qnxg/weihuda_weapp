import request from './request'

// 调休的接口
export interface FlexTime {
  from?: FlexDay // 调休开始时间，可选
  to: FlexDay // 调休结束时间
  desc: string // 描述，将会返回给前端用作展示
  time: XnXq // 学年学期
}

export interface FlexDay {
  week: number // 第几周
  day: number // 星期几
}

export interface XnXq {
  xn: number // 学年
  xq: number // 学期
}

/**
 * 获取调休列表
 */
export const getFlexTimeList = async () => {
  return request.get<FlexTime[]>('/flex-time')
}
