import type { CourseInfo } from '@/apis/hdjw/classTable'

/**
 * @interface CurDatesOfWeek 定义Header组件显示的日期格式
 */
export interface CurDatesOfWeek {
  month: number
  day: number
}

/**
 * @interface ClassTableItem 课表的格子的信息
 */
export interface ClassTableItem {
  /** 该格子下的课程列表，默认第一个课程是显示在格子上的 */
  courses: Array<{ courseItem: CourseInfo; bgColor: string; fgColor: string }>
  /** 该格子的长度，用来合并格子 */
  len: number
  /** 该格子是否被合并了，用于网格的渲染 */
  merged: boolean
}
