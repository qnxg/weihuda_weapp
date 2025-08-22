import request from '../request'

/**
 * ClassTable
 */
export interface CourseInfo {
  className: string, // 上课班级
  courseId?: string, // 课程代码
  courseName: string, // 课程名称
  credit?: number, // 学分
  day: number, // 周几上
  extra?: string, // 额外备注信息
  place?: string, // 上课地点
  area?: string, // 上课校区
  time: number, // 上课节次。注意，ClassTableItem 里的 time 都是 -1
  teacher?: string, // 教师
  weeks: number[], // 在哪周上课
  type?: string, // 课程类型
  customizeId: number, // 自定义课程 id
  bgColor?: string, // 背景颜色（前端生成）
}

/**
 * 获取课表
 * @returns 课表
 */
export const getClassTable = async (xn: string, xq: number) => {
  return request.get<CourseInfo[]>('/hdjw/class-table', {
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
