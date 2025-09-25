import request from "./request"

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
 * 获取当前用户信息
 * @returns 当前用户信息
 */
export const getUserInfo = async () => {
  return request.get<UserInfo>('/info/user')
}
