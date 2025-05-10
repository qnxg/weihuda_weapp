import request from './request'

/**
 * SmesterInfo，本学期信息
 */
export interface SmesterInfo {
  /**
   * 下一个学期开始时间，用来首页的倒计时
   */
  next: string
  /**
   * 本学期开始时间
   */
  startDate: string
  /**
   * 第几学期
   */
  term: number
  /**
   * 下一个假期开始时间，用来首页的倒计时
   */
  vacation: string
  /**
   * 学年
   */
  year: number
}

/**
 * UserInfo，当前用户信息
 */
export interface UserInfo {
  /**
   * 班级
   */
  class: string
  /**
   * 学院
   */
  college: string
  /**
   * 入学年份
   */
  enter: number
  /**
   * 专业
   */
  major: string
  /**
   * 姓名
   */
  name: string
  /**
   * 性别
   */
  sex: string
  /**
   * 学号
   */
  stuId: string
  /**
   * 学制
   */
  xz: number
}

/**
 * 获取本学期信息
 * @returns 本学期信息
 */
export const getSmesterInfo = async () => {
  return request.get<SmesterInfo>('/info/smester')
}

/**
 * 获取当前用户信息
 * @returns 当前用户信息
 */
export const getUserInfo = async () => {
  return request.get<UserInfo>('/info/user')
}
