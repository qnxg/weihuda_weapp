import request from '../request'
import { useCacheableGetJson } from '@/utils/storage/cache/requestCache'
import type { DependencyList } from 'react'

/**
 * ClassTable
 */
export interface CourseInfo {
  /** 上课班级 */
  className: string
  /** 课程代码 */
  courseId?: string
  /** 课程名称 */
  courseName: string
  /** 学分 */
  credit?: number
  /** 周几上，周一是 1，周日是 0 */
  day: number
  /** 额外备注信息 */
  extra?: string
  /** 上课地点 */
  place?: string
  /** 上课校区 */
  area?: string
  /** 上课人数 */
  people: number
  /**
   * 上课节次。
   *
   * 注意，ClassTableItem 里的 time 都是 -1
   */
  time: number
  /** 教师 */
  teacher?: string
  /** 在哪些周上课 */
  weeks: number[]
  /** 课程类型 */
  type?: string
  /** 自定义课程 id */
  customizeId: number
}

/**
 * 获取课表
 * @returns 课表
 */
export const getCourseApi = async (xn: string, xq: number) => {
  return request.get<CourseInfo[]>('/hdjw/class-table', {
    data: {
      xn,
      xq,
    },
  })
}

export function useCourse(
  xn: string | undefined,
  xq: string | undefined,
  deps: DependencyList
) {
  return useCacheableGetJson<CourseInfo[]>(
    '/hdjw/class-table',
    xn !== undefined && xq !== undefined
      ? [
          ['xn', xn],
          ['xq', xq],
        ]
      : undefined,
    deps
  )
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
  location?: string
  /**
   * 第几节
   */
  section: string
  /**
   * 教师
   */
  teachers?: string
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

export interface ExtraCourseInfo {
  className: string
  courseId: string
  courseName: string
  type: string
  credit: number
  area: string
  people: number
  extra?: string
  teacher: string
}

/**
 * 获取无课表课程
 * @param xn 学年
 * @param xq 学期
 * @returns 无课表课程
 */
export const getExtraCourseApi = async (xn: number, xq: number) => {
  return request.get<ExtraCourseInfo[]>('/hdjw/class-table-extra', {
    data: {
      xn,
      xq,
    },
  })
}
