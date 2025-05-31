export interface Radio {
  checked: boolean
  id: string
  text: Array<string>
}

/**
 * @interface EmptyRoomState 空教室列表State
 */
export interface EmptyRoomState {
  pickerValue: Array<number>
  radioValue: Array<Radio>
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
