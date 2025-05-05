import Taro from '@tarojs/taro'

/**
 * Token
 */
type Token = string

/**
 * 学期配置
 */
export interface TermConfig {
  /**
   * 本学期开始日期
   */
  start: string
  /**
   * 第几学期，1 秋季学期，2 春季学期，3 小学期
   */
  term: number
  /**
   * 学年
   */
  year: number
}

/**
 * 用户信息
 */
export interface UserInfo {
  class: string
  name: string
  stuId: string
  major: string
  enter: number
  college: string
  sex: string
  xz: number
}

const enum KEY {
  TOKEN = 'Authorization',
  NEW_TOKEN = 'Token',
  TERM_CONFIG = 'Config-Term',
  USER_INFO = 'User-Info',
  VERSION = 'Version',
  TABLE_MODE = 'Table-Mode',
  CARD_ORDER = 'Card-Order'
}

const getToken = () => {
  const token = Taro.getStorageSync(KEY.NEW_TOKEN)
  if (token) return token
  const oldToken = Taro.getStorageSync(KEY.TOKEN)
  Taro.setStorageSync(KEY.NEW_TOKEN, oldToken.token)
  return oldToken.token
}
const setToken = (v: Token) => Taro.setStorageSync(KEY.NEW_TOKEN, v)

const getTermConfig = () => Taro.getStorageSync<TermConfig>(KEY.TERM_CONFIG)
const setTermConfig = (v: TermConfig) => Taro.setStorageSync(KEY.TERM_CONFIG, v)

const getUserInfo = () => Taro.getStorageSync<UserInfo>(KEY.USER_INFO)
const setUserInfo = (v: UserInfo) => Taro.setStorageSync(KEY.USER_INFO, v)

const getLocalVersion = () => Taro.getStorageSync<string>(KEY.VERSION)
const setLocalVersion = (v: string) => Taro.setStorageSync(KEY.VERSION, v)

const getTableMode = () => Taro.getStorageSync<boolean>(KEY.TABLE_MODE)
const setTableMode = (v: boolean) => Taro.setStorageSync(KEY.TABLE_MODE, v)

const getClassTable = (year: number, term: number) => Taro.getStorageSync(`Table-${year}-${term}-List`)
const setClassTable = (year: number, term: number, v: any) => Taro.setStorageSync(`Table-${year}-${term}-List`, v)

const getTermStart = (year: number, term: number) => Taro.getStorageSync(`Table-${year}-${term}-Start`)
const setTermStart = (year: number, term: number, v: any) => Taro.setStorageSync(`Table-${year}-${term}-Start`, v)

const getCardOrder = (): string | undefined => Taro.getStorageSync(KEY.CARD_ORDER)
const setCardOrder = (order: string) => Taro.setStorageSync(KEY.CARD_ORDER, order)

export default {
  getToken,
  setToken,
  getTermConfig,
  setTermConfig,
  getUserInfo,
  setUserInfo,
  getLocalVersion,
  setLocalVersion,
  getTableMode,
  setTableMode,
  getClassTable,
  setClassTable,
  getTermStart,
  setTermStart,
  getCardOrder,
  setCardOrder
}
