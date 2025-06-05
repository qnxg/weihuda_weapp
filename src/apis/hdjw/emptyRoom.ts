import request from '../request'

/**
 * 请求参数
 */
export interface EmptyRoomParams {
  /**
   * 楼栋id
   */
  buildId: string
  /**
   * 星期几
   */
  day: number
  /**
   * 第几节
   */
  jc: string
  /**
   * 第几周
   */
  week: number
  /**
   * 学年
   */
  xn: number
  /**
   * 学期
   */
  xq: number
}

/**
 * EmptyRoomItem，空教室
 */
export interface EmptyRoomItem {
  /**
   * 考试座位数
   */
  examSeat: number
  /**
   * 教室名称
   */
  name: string
  /**
   * 座位数量
   */
  seat: number
  /**
   * 类型
   */
  type: string
}

/**
 * 获取空教室
 */
export const getEmptyRoom = async (params: EmptyRoomParams) => {
  return request.get<EmptyRoomItem[]>('/hdjw/empty-room', {
    data: params,
  })
}
