import request from './request'

export interface Announcement {
  id: number
  title: string
  content: string
  url?: string
  createdAt: string
}

/**
 * 获取公告列表
 */
export const getAnnouncement = async () => {
  return request.get<Announcement[]>('/announcement')
}
