import request from './request'

/**
 * 本学期信息
 */
export interface CurrentSemesterInfo {
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
 * 获取本学期信息
 * @returns 本学期信息
 */
export const getSemesterInfo = async () => {
  return request.get<CurrentSemesterInfo>('/info/smester')
}
