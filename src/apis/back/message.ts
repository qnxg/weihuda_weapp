import request from '@/utils/request'

export interface Message {
  id: number
  title: string
  content: string
  url: string
  create_at: string
}

/**
 * 获取消息盒子消息
 */
export const getMessage = async () => {
  return request.get<Message[]>('/message')
}
