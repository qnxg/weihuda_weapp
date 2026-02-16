// eslint-disable-next-line import/no-cycle
import request from './request'

export interface Bind {
  code: string
  stuId: string
  password: string
}

/**
 * 绑定
 */
export const postBind = async (data: Bind) => {
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
