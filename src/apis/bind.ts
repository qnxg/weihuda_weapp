// eslint-disable-next-line import/no-cycle
import request from './request'

// TODO: 绑定数据类型为any

/**
 * 绑定
 */
export const postBind = async (data: any) => {
  return request.post<string>('/bind', {
    data,
  })
}

/**
 * 解除绑定
 */
export const postUnbind = async () => {
  return request.post<string>('/unbind')
}
