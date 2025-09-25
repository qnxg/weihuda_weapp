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
export const getCurrentSemesterInfoApi = async () => {
  return request.get<CurrentSemesterInfo>('/info/smester')
}

/**
 * 获取开课时间
 * @returns 开课时间
 */
export const getClassStartDateApi = async (xn: string, xq: number) => {
  return request.get<string>('/hdjw/class-start-date', {
    data: {
      xn,
      xq,
    },
  })
}

// /**
//  * 获取学期开始时间表
//  *
//  * 详情见后端代码和工作台的小程序设置页面
//  */
// export const getClassStartDateTableApi = async () => {
//   return request.get<[string, string][]>('/info/smester')
// }
