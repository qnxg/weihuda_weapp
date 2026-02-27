import Taro from '@tarojs/taro'

/**
 * Token
 */
type Token = string

export const tokenKey = 'Token'

const getToken = () => {
  const token = Taro.getStorageSync(tokenKey)
  return token
}
const setToken = (v: Token) => Taro.setStorageSync(tokenKey, v)

export default {
  getToken,
  setToken,
}
