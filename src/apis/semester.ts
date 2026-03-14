import request from './request'
import { useCacheableGetJson } from '@/utils/storage/requestCache'
import type { DependencyList } from 'react'

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
   * 假期开始时间，用来首页的倒计时
   *
   * 如果当前处于寒暑假，则为当前假期开始时间，
   * 否则为下一个寒暑假开始时间。
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

export function useCurrentSemesterInfo(deps: DependencyList) {
  return useCacheableGetJson<CurrentSemesterInfo>('/info/smester', [], deps)
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

export function useClassStartDate(
  xn: string | undefined,
  xq: string | undefined,
  deps: DependencyList
) {
  return useCacheableGetJson<string>(
    '/hdjw/class-start-date',
    xn !== undefined && xq !== undefined
      ? [
          ['xn', xn],
          ['xq', xq],
        ]
      : undefined,
    deps
  )
}

// 下面拆分函数是有意的，当前后端的这两个接口过于混乱，因此将其抽象，方便以后大改这两个接口
// 当前后端处理这种请求的性能足够，重复请求不是问题

/**
 * 获取当前学年学期
 */
export const getCurrentXnXq = async (): Promise<[number, number]> => {
  const r = await getCurrentSemesterInfoApi()
  return [r.year, r.term]
}
