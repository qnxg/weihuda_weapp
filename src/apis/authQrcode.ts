import request from './request'

export type AuthQrcodeStatus = 'unused' | 'using' | 'used'

/**
 * 获取二维码状态
 */
export const getAuthQrcodeStatusApi = async (code: string) => {
  return request.get<AuthQrcodeStatus>(`/auth-qrcode/status/${code}`)
}

/**
 * 更新二维码状态
 */
export const putAuthQrcodeStatusApi = async (
  code: string,
  newStatus: 'using' | 'confirmed' | 'canceled'
) => {
  return request.put<AuthQrcodeStatus>(`/auth-qrcode/status/${code}`, {
    data: {
      status: newStatus,
    },
  })
}
