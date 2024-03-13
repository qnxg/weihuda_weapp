import dayjs from 'dayjs'

/**
 * 计算日期是否到期，以及相差几天
 * @param date 日期字符串
 */
function calDiffDate(date: string): string {
  const returnTime = dayjs(date)
  const nowTime = dayjs()
  // 取整，因为当前时间计算可能不为整数
  const diffTime = nowTime.diff(returnTime, 'day')
  const overdue = nowTime.isAfter(returnTime, 'day')

  return `${overdue ? '过期' : '剩余'}${Math.abs(diffTime)}天`
}

/**
 * 返回当前的星期数
 */
export function dayOfWeek(): number {
  return dayjs().day()
}

/**
 * 返回学期的开始时间
 * @param startDate 学期的开始时间
 */
export function nowWeek(startDate: string): number {
  return Math.floor(dayjs(new Date()).diff(dayjs(startDate), 'day') / 7)
}

/**
 * 判断是否当前有课
 * @param weeks 本节课上课的周数
 * @param current 当前周为多少
 */
export function judgeOn(weeks: string, current: number): boolean {
  const weekArray: Array<number> = weeks.split(',').map((item) => {
    return parseInt(item)
  })

  return weekArray.indexOf(current) >= 0
}

export function markBook(borrow: Array<any>): Array<any> {
  return borrow.map((item) => {
    const diff = calDiffDate(item['returndate='])
    return {
      loanCount: item.loancount,
      returnDate: item['returndate='],
      title: item.title,
      diff: diff
    }
  })
}
