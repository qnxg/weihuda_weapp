import request from './request'
import type { IPageQueryData } from './interface'

export interface IBtnConfigItem {
  /** 文本 */
  text: string
  /** 样式 */
  theme?: 'primary' | 'secondary' | 'plain'
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
  /** 是否完整显示在首页 */
  isShow: boolean
  /** 状态 */
  status: number
  /** 跳转链接 */
  url?: string
  /** 创建时间 */
  createdAt: string
}

export interface INoticePageResponseData {
  count: number
  rows: INotice[]
}

/**
 * 获取消息通知列表分页
 */
export const getNoticePageApi = async (queryData: IPageQueryData) => {
  return request.get<INoticePageResponseData>('/notice', {
    data: queryData,
  })
}

/**
 * 编辑消息通知
 */
export const putNoticeByIdApi = async (id: number, status: number) => {
  return request.put<string>(`/notice/${id}`, {
    data: { status },
  })
}
