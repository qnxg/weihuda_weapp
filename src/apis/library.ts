import request from './request'

export interface Book {
  /**
   * 作者
   */
  author: string
  /**
   * 图书的isbn
   */
  isbn: string
  /**
   * 所在图书馆
   */
  library: string
  /**
   * 书名
   */
  title: string
}

export interface Borrowing extends Book {
  /**
   * 应还时间
   */
  return_date: string
  /**
   * 书名
   */
  title: string
}

export interface Borrowed extends Book {
  time: string
  type: string
}

export interface Finance {
  /**
   * 条型号
   */
  barcode: string
  /**
   * 花费
   */
  cost: string
  /**
   * 财经类型
   */
  fee_type: string
  /**
   * 支付状态
   */
  pay_sign: string
  /**
   * 发生地，发生馆-发生地点
   */
  place: string
  /**
   * 时间
   */
  time: string
}

export interface LibraryRes {
  borrowed: Borrowed[]
  borrowing: Borrowing[]
  finance: Finance[]
}

/**
 * 获取图书借阅信息
 */
export const getLibraryApi = async () => {
  return request.get<LibraryRes>('/library')
}
