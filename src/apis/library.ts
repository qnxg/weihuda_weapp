import request from '@/utils/request'

// TODO: 返回类型暂时不明确

/**
 * 获取图书借阅信息
 */
export const getLibraryApi = async () => {
  return request.get<any>('/library')
}
