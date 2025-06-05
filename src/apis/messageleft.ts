import request from './request'
import type { IPageQueryData } from './interface'

export interface IMessageLeft {
  /** id */
  id: number
  /** 留言内容 */
  desc: string
  /** 学号 */
  stuId: string
  /** 是否公开 */
  isAgree: number
  /** 发送时间 */
  sendTime: string
  /** 是否发送 */
  isSend: number
}

export interface IMessageLeftPageResponseData {
  count: number
  rows: IMessageLeft[]
}

export interface IMessageLeftPageQueryData
  extends IPageQueryData,
    Partial<IMessageLeft> {}

/**
 * 新增留言板
 */
export const postMessageLeftApi = async (postData: Partial<IMessageLeft>) => {
  return request.post<IMessageLeftPageResponseData>('/message-left', {
    data: postData,
  })
}
