import request from '../back/request'

/**
 * 获取未读邮件数量
 */
export const getUnReadCount = async () => {
  return request.get<number>('/pt/email')
}
