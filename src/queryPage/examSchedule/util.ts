import dayjs from 'dayjs'
import type { DateType } from './index.config'
import type { ExamArrange } from '@/apis/hdjw/examArrange'

/**星期英文简写标题 */
export const dayTitles: Array<string> = [
  '日',
  '一',
  '二',
  '三',
  '四',
  '五',
  '六',
]
// export const dayTitles: Array<string> = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

/**
 * @returns 返回考试日期的DateType形式
 * @param e 考试信息
 */
export const ExamDate = (e: ExamArrange): DateType => {
  /** 正则表达式提取数字 */
  const numArr = e.date.match(/[1-9][0-9]*/g) as RegExpMatchArray
  const [y, m, d] = numArr
  if (y === undefined || m == undefined || d == undefined) {
    throw Error('考试日期提取错误')
  }
  return {
    year: +y,
    month: +m - 1, // 月份要转换为 0-11 的范围形式
    date: +d,
    day: +dayjs(new Date(+y, +m - 1, +d)).day(),
  }
}

/**
 * @returns 返回指定月份第一天的星期
 * @param y 年
 * @param m 月 0 - 11
 */
export const firstDayOfMonth = (y: number, m: number): number => {
  return +dayjs(new Date(y, m)).startOf('month').format('d')
}

/**
 * @returns 返回指定月份的最后一天星期
 * @param y 年
 * @param m 月 0 - 11
 */
export const lastDayOfMonth = (y: number, m: number): number => {
  return +dayjs(new Date(y, m)).endOf('month').format('d')
}

/**
 * @returns 返回指定日期月份的最后一天日期
 * @param y 年份
 * @param m 月 0 - 11
 */
export const lastDateOfMonth = (y: number, m: number): number => {
  return +dayjs(new Date(y, m)).endOf('month').format('D')
}

/**
 * @returns 第二维长度为7且对应星期的二维数组
 * @param pBlank 当前上一个月显示到的日期 (含考试信息)
 * @param validDates 当前月日期 (含考试信息)
 * @param nBlank 当前下一个月显示到的日期 (含考试信息)
 */
export const totalCells = (
  pBlank: Array<DateType>,
  validDates: Array<DateType>,
  nBlank: Array<DateType>
): Array<Array<DateType>> => {
  const cells = [...pBlank, ...validDates, ...nBlank]
  const totalRows: Array<Array<DateType>> = []
  for (let i = 0; i < cells.length; i += 7) {
    totalRows.push(cells.slice(i, i + 7))
  }
  return totalRows
}

/**
 * @returns 初始要显示的月份状态
 * 默认为当天
 */
export const initialDisplayDate = (): DateType => {
  const y = +dayjs().year()
  const m = +dayjs().month() // 月 (0 ~ 11)
  const d = +dayjs().date()
  return {
    year: y,
    month: m,
    date: d,
    day: +dayjs(new Date(y, m, d)).day(),
  }
}

/**
 * @param es 所有考试信息数组
 * @returns 初始默认高亮的日期(包含考试信息)
 */
export const initialHighlight = (es: Array<ExamArrange>): DateType => {
  const h = initialDisplayDate()
  h.exams = []
  for (const e of es) {
    const et = ExamDate(e)
    if (et.year === h.year && et.month === h.month && et.date === h.date) {
      h.exams.push(e)
    }
  }
  return h
}

/**
 * @returns 返回页面中出现的上一个月的日期数组(已经记录了考试信息)
 * @param d 指定日期
 * @param es 考试列表
 */
export const prevBlank = (
  d: DateType,
  es: Array<ExamArrange>
): Array<DateType> => {
  const first: DateType = {
    year: d.year,
    month: d.month,
    date: 1,
    day: firstDayOfMonth(d.year, d.month),
  }
  const prev: Array<DateType> = []
  const tmpYear = first.month > 0 ? first.year : first.year - 1
  const tmpMonth = first.month > 0 ? first.month - 1 : 11
  const prevLast: number = lastDateOfMonth(tmpYear, tmpMonth)
  for (let i = first.day - 1, cnt = 0; i >= 0; --i, ++cnt) {
    prev.unshift({
      year: tmpYear,
      month: tmpMonth,
      date: prevLast - cnt,
      day: i,
    })

    /** 存储考试信息 */
    prev[0]!.exams = []
    for (const e of es) {
      const et = ExamDate(e)
      if (
        et.year === prev[0]!.year &&
        et.month === prev[0]!.month &&
        et.date === prev[0]!.date
      ) {
        prev[0]!.exams.push(e)
      }
    }
  }
  return prev
}

/**
 * @returns 返回页面中出现的下一个月的日期数组(每一天已经记录了当天的考试信息)
 * @param d 指定日期
 * @param es 考试列表
 */
export const nextBlank = (
  d: DateType,
  es: Array<ExamArrange>
): Array<DateType> => {
  const last: DateType = {
    year: d.year,
    month: d.month,
    date: lastDateOfMonth(d.year, d.month),
    day: lastDayOfMonth(d.year, d.month),
  }
  const nxt: Array<DateType> = []
  for (let i = last.day + 1, cnt = 1; i <= 6; ++i, ++cnt) {
    const temp: DateType = {
      year: last.month === 11 ? last.year + 1 : last.year,
      month: (last.month + 1) % 12,
      date: cnt,
      day: (last.day + cnt) % 7,
      exams: [],
    }
    for (const e of es) {
      const et = ExamDate(e)
      if (
        et.year === temp.year &&
        et.month === temp.month &&
        et.date === temp.date &&
        temp.exams !== undefined
      ) {
        temp.exams.push(e)
      }
    }
    nxt.push(temp)
  }
  return nxt
}

/**
 * @returns 返回本月的全部日期信息数组(每一天已经记录了当天考试信息)
 */
export const datesInMonth = (
  y: number,
  m: number,
  es: Array<ExamArrange>
): Array<DateType> => {
  const dates: Array<DateType> = []
  const cnt = dayjs(new Date(y, m)).daysInMonth()
  const firstDay = firstDayOfMonth(y, m)
  for (let i = 1; i <= cnt; ++i) {
    const temp: DateType = {
      year: y,
      month: m,
      date: i,
      day: (firstDay + i - 1) % 7,
      exams: [],
    }

    /** 存储考试信息 */
    for (const e of es) {
      const et = ExamDate(e)
      if (
        et.year === temp.year &&
        et.month === temp.month &&
        et.date === temp.date &&
        temp.exams !== undefined
      ) {
        temp.exams.push(e)
      }
    }
    dates.push(temp)
  }
  return dates
}
