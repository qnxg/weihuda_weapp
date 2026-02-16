import request from './request'

export interface FeedbackInfo {
  /**
   * 反馈 id
   */
  id: number
  /**
   * 联系方式
   */
  contact?: string
  /**
   * 反馈描述
   */
  desc: string
  /**
   * 图片地址
   */
  imgUrl?: string
  /**
   * 学号，未登录时提交的问题反馈，学号才会为空
   */
  stuId?: string
  /**
   * 反馈时间
   */
  createdAt: string
  /**
   * 最后更新时间
   */
  updatedAt: string
  /**
   * 处理状态
   */
  status: 0 | 1 | 2 | 3
}

interface GetResponse {
  count: number
  rows: FeedbackInfo[]
}

/**
 * 查询反馈
 */
export const getFeedbackPageApi = async (page: number) => {
  return request.get<GetResponse>('/feedback', {
    data: {
      page,
    },
  })
}

export interface AddFeedbackReq {
  stuId?: string
  desc: string
  contact?: string
  imgUrl?: string
}
/**
 * 添加反馈
 */
export const postFeedback = async (
  data: AddFeedbackReq,
  noAuth: boolean = false
) => {
  const url = noAuth ? '/feedback/no_auth' : '/feedback'
  return request.post<string>(url, {
    data,
  })
}

export interface FeedbackMsg {
  id: number
  typ: string
  msg?: string
  stuId: string
  createdAt: string
}
export const getFeedbackMsg = async (feedbackId: number) => {
  return request.get<FeedbackMsg[]>('/feedback/msg', {
    data: {
      feedbackId,
    },
  })
}
