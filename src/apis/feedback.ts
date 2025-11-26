import request from './request'

export interface FeedbackData {
  /**
   * 反馈类型，两种取值，suggestion / bug
   */
  type: string
  /**
   * 反馈描述
   */
  desc: string
  /**
   * 联系方式
   */
  contact: string
  /**
   * 反馈时间，Unix 时间戳
   */
  createTime: string | number
  /**
   * 学号
   */
  stuId: string
  /**
   * 图片地址
   */
  imgUrl: string
  /**
   * 处理状态
   */
  status: 0 | 1 | 2 | 3
  /**
   * 处理结果
   */
  comment: string
}

interface GetResponse {
  count: number
  rows: FeedbackData[]
}

/**
 * 查询反馈
 */
export const getFeedbackPageApi = async (stuId: string) => {
  return request.get<GetResponse>('/feedback/no-auth', {
    data: {
      stuId,
    },
  })
}

/**
 * 添加反馈
 */
export const postFeedback = async (
  data: Partial<FeedbackData>,
  noAuth = false
) => {
  const url = noAuth ? '/feedback/no-auth' : '/feedback'
  return request.post<string>(url, {
    data,
  })
}
