import request from '../request'

/**
 * ClassTable
 */
export interface ClassTableItem {
  /**
   * 班级id
   */
  classId: string
  /**
   * 课程名称
   */
  classname: string
  /**
   * 星期几
   */
  day: number | string
  /**
   * 结束时间
   */
  endTime: string
  /**
   * 课程id
   */
  id: string
  /**
   * 授课地点
   */
  location: string
  /**
   * 第几节
   */
  section: string
  skqk: string
  /**
   * 开始时间
   */
  startTime: string
  /**
   * 教师姓名
   */
  teachers: string
  type: number
  /**
   * 上课周数
   */
  week: string
}

/**
 * 获取课表
 * @returns 课表
 */
export const getClassTable = async (xn: string, xq: number) => {
  return request.get<ClassTableItem[]>('/hdjw/class-table', {
    data: {
      xn,
      xq,
    },
  })
}

/**
 * 获取开课时间
 * @returns 开课时间
 */
export const getClassStartDate = async (xn: string, xq: number) => {
  return request.get<string>('/hdjw/class-start-date', {
    data: {
      xn,
      xq,
    },
  })
}

/**
 * 添加课程时的请求数据
 */
export interface PostData {
  /**
   * 课程名称
   */
  classname: string
  /**
   * 周几
   */
  day: string
  /**
   * 授课地点
   */
  location: string
  /**
   * 第几节
   */
  section: string
  /**
   * 教师
   */
  teachers: string
  /**
   * 上课周数
   */
  week: string
  /**
   * 学年
   */
  xn: number
  /**
   * 学期
   */
  xq: number
}

/**
 * 添加自定义课程
 * @param data 新增的课程
 */
export const postCourseApi = async (data: PostData) => {
  return request.post<string>('/course', {
    data,
  })
}

/**
 * 删除自定义课程
 * @param id 自定义课程id
 */
export const deleteCourseApi = async (id: number) => {
  return request<string>({
    url: `/course?id=${id}`,
    method: 'DELETE',
  })
}
