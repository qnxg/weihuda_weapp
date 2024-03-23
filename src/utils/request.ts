import { getTokenApi } from '@/apis/back/token'
import Taro from '@tarojs/taro'
import storage from './storage'
import { BASE_URL } from './url'

/**
 * Response
 */
export interface Response {
  /**
   * 状态码
   */
  code: number
  /**
   * 具体数据，请求失败时为null
   */
  data: Data
  /**
   * 提示消息，该消息会直接显示在页面中
   */
  msg: string
}

/**
 * 具体数据，请求失败时为null
 */
export type Data = Datum[] | { [key: string]: any } | null | string | number

export type Datum = any[] | boolean | number | { [key: string]: any } | null | string

// 跳转到bind界面
const toBind = () => {
  const duration = 700
  Taro.showToast({
    title: '登录过期，请重新登录',
    icon: 'none',
    duration
  })
  setTimeout(() => {
    Taro.reLaunch({
      url: '/pages/bind/index',
      fail: function (err) {
        console.log(err)
      }
    })
  }, duration)
}

// 白名单，不需要token的请求
const whiteList = ['/bind', '/token', '/feedback/no-auth']

/**
 * 请求函数
 * @param options 请求配置项
 */
async function request<T extends Data>(options: Taro.request.Option<Response>): Promise<T> {
  // 获取url
  const url = options.url

  // 检查token，如果没有则获取
  let token = storage.getToken()
  if (!token && !whiteList.includes(url)) {
    try {
      const newToken = await getTokenApi()
      token = newToken
    } catch (err) {
      toBind()
      throw err
    }
  }

  if (!whiteList.includes(url)) {
    // 设置header
    options.header = {
      Authorization: token
    }
  }

  // 设置baseURL
  options.url = BASE_URL + options.url

  // 发起请求
  const response = await Taro.request(options)

  if (response.data.code === 401) {
    // 重新获取token，并重新发起请求
    await getTokenApi()
    return request<T>(options)
  }

  if (response.data.code !== 200) {
    // 有些请求不需要弹出提示，例如知湖阅读文章获取积分的请求
    // 不用弹出提示的请求会在msg中包含NO_TOAST
    if (!response.data.msg.includes('NO_TOAST')) {
      Taro.showToast({
        title: response.data.msg,
        icon: 'none'
      })
    }
    throw new Error(response.data.msg)
  }

  // 返回数据
  return response.data?.data as T
}

type WithoutUrlOption = Omit<Taro.request.Option, 'url'>

// 重写get方法
request.get = <T extends Data>(url: string, options: WithoutUrlOption = {}) => {
  return request<T>({
    ...options,
    url,
    method: 'GET'
  })
}

// 重写post方法
request.post = <T extends Data>(url: string, options: WithoutUrlOption = {}) => {
  return request<T>({
    ...options,
    url,
    method: 'POST'
  })
}

// 重写put方法
request.put = <T extends Data>(url: string, options: WithoutUrlOption = {}) => {
  return request<T>({
    ...options,
    url,
    method: 'PUT'
  })
}

export default request
