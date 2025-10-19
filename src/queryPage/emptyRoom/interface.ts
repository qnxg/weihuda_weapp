export interface Radio {
  id: string
  text: Array<string>
}

export interface EmptyRoom {
  name: string
  type: string
  seat: number
  examSeat: number
}

export interface Hdjw {
  emptyRoom: EmptyRoom[]
}

/**
 * 请求完成数据的数据结构
 */
export interface RootObject {
  hdjw: Hdjw
}

export type PickerValue = {
  /**
   * 教学楼id
   */
  buildId: number
  /**
   * 第几周
   */
  weekIndex: number
  /**
   * 星期几
   */
  dayOfTheWeek: number
}
