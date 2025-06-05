import type { Subject } from '@/models/classTable'

/**
 * @interface CurDatesOfWeek 定义Header组件显示的日期格式
 */
export interface CurDatesOfWeek {
  month: number
  day: number
}

/**
 * @interface FormatTable 定义格式化之后的课表模型
 */
export interface FormatTable extends Subject {
  JCFrom?: number
  JCTo?: number
  len?: number
  thisWeek?: boolean
  show?: boolean
  showMoreTag?: boolean
}
