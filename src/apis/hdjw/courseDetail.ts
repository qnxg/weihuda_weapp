import request from '../request'

/**
 * 获取成绩
 * @param xn 学年
 * @param xq 学期
 * @param keyword 关键字
 */
export const getCourseDetail = async (xn: string | number, xq: string | number, keyword: string) => {
  return request.get<any>('/hdjw/course', {
    data: {
      xn,
      xq,
      keyword
    }
  })
}
