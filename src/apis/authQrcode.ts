import request from '@/utils/request'

export type AuthQrcodeStatus = 'unused' | 'using' | 'used'

/**
 * 获取二维码状态
 */
export const getAuthQrcodeStatusApi = async (code: string) => {
  return request.get<AuthQrcodeStatus>(`/old/auth-qrcode/status/${code}`)
}

/**
 * 更新二维码状态
 */
export const putAuthQrcodeStatusApi = async (code: string, newStatus: 'using' | 'confirmed' | 'canceled') => {
  return request.put<AuthQrcodeStatus>(`/old/auth-qrcode/status/${code}`, {
    data: {
      status: newStatus
    }
  })
}
