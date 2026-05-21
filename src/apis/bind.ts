// eslint-disable-next-line import/no-cycle
import request from './request'

export interface Bind {
  code: string
  stuId: string
  password: string
  powTicket: string
  powAnswer: number
}

export interface BindPow {
  ticket: string
  difficulty: number
}

export const getPow = async (stuId: string): Promise<BindPow> => {
  return request.get<BindPow>('/bind/pow', {
    data: {
      stuId,
    },
  })
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

export interface TFAInfo {
  phone: string
}

export const getTFA = async (): Promise<TFAInfo | null> => {
  return request.get<TFAInfo | null>('/tfa')
}

export const sendTFASms = async (): Promise<string> => {
  return request.get<string>('/tfa/send_sms')
}

export const verifyTFA = async (code: string): Promise<string> => {
  return request.post<string>('/tfa/verify', {
    data: {
      code,
    },
  })
}
