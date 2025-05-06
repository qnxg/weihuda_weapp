import request from '../back/request'

/**
 * 获取实验安排
 */
export const getLabArrange = async () => {
    return request.get<any[]>('/pt/lab-arrange')
  }