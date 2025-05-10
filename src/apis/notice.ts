import request from './request'
import { IPageQueryData } from './interface'

export interface IBtnConfigItem {
    /** 文本 */
    text: string
    /** 样式 */
    theme?: 'primary' | 'default' | 'plain'
    /** 功能 */
    type?: 'button' | 'link'
    /** 值 */
    value?: string
}

export interface INotice {
  /** id */
  id: number
  /** 内容 */
  content: string
  /** 收件人 */
  stuId: string
  /** 发送时间 */
  sendTime: string
  /** 是否完整显示在首页 */
  isShow: number
  /** 状态 */
  status: number
  /** 结果 */
  result: string
  /** 按钮配置 */
  btnConfig: string | IBtnConfigItem[]
}

export interface INoticePageResponseData {
  count: number
  rows: INotice[]
}

export interface INoticePageQueryData extends IPageQueryData, Partial<INotice> {}

/**
 * 获取消息通知列表分页
 */
export const getNoticePageApi = async (queryData: INoticePageQueryData) => {
  return request.get<INoticePageResponseData>('/notice', {
    data: queryData
  })
}

/**
 * 编辑消息通知
 */
export const putNoticeByIdApi = async (id: number, putData: Partial<INotice>) => {
  return request.put<INoticePageResponseData>(`/notice/${id}`, {
    data: putData
  })
}
