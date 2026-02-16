import request from './request'
import type { IPageQueryData } from './interface'

export interface IMessageLeft {
  /** id */
  id: number
  /** 留言内容 */
  desc: string
  /** 是否公开 */
  isAgree: number
  /** 发送时间 */
  sendTime: string
  /** 是否发送 */
  isSend: number
  /** 邮箱 */
  email?: string
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
 * @returns 成功时返回提示文案
 */
export const postMessageLeftApi = async (postData: Partial<IMessageLeft>) => {
  return request.post<string>('/message-left', {
    data: postData,
  })
}
