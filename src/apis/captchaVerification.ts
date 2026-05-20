import request from './request'

/**
 * 短信验证码流程接口（路径与字段需与后端一致；若不一致请只改本文件）。
 */

interface CaptchaPhonePayload {
  phone: string
}

/**
 * 获取当前登录用户用于接收短信的手机号（可为脱敏号码，仅作展示）。
 */
export async function getCaptchaPhoneApi(): Promise<string> {
  const data = await request.get<CaptchaPhonePayload | string>('/captcha/phone')
  if (typeof data === 'string') {
    return data
  }
  return data.phone
}

/** 向当前绑定手机发送短信验证码 */
export async function postCaptchaSmsSendApi(): Promise<void> {
  await request.post<string>('/captcha/sms/send')
}

/** 提交短信验证码，通过后服务端应更新会话或业务状态 */
export async function postCaptchaSmsVerifyApi(code: string): Promise<void> {
  await request.post<string>('/captcha/sms/verify', {
    data: { code },
  })
}
