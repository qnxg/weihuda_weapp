import request from '../request'

/**
 * CardInfo，校园卡余额
 */
export interface CardInfo {
  /**
   * 校园卡账号
   */
  account: number
  /**
   * 余额
   */
  balance: number
}

/**
 * 获取校园卡余额
 */
export const getCardInfo = async () => {
  return request.get<CardInfo>('/pt/card-info')
}

/**
 * 具体数据，请求失败时为null
 */
export interface CardHistoryData {
  /**
   * 交易项列表
   */
  items: CardHistoryItem[]
  /**
   * 总交易金额
   * 如果是充值金额则是正数，如果是消费金额则是负数
   */
  total: number
  /**
   * 交易数量
   */
  TranCount: number
}

/**
 * CardHistoryItem，校园卡账单
 */
export interface CardHistoryItem {
  /**
   * 时间
   */
  effectDate: string
  /**
   * 记账日期
   */
  jourDate: string
  /**
   * 记账名称
   */
  jourName: string
  /**
   * 记账编号
   */
  jourNum: number
  /**
   * 交易后余额
   */
  nowAmt: string
  /**
   * 金额
   */
  tranAmt: string
  /**
   * 交易位置
   */
  tranLocation?: string
  /**
   * 交易名称
   */
  tranname: string
}

interface CardHistoryParams {
  /**
   * 月
   */
  month: string
  /**
   * 类型，1 支出 2 充值
   */
  type: string
  /**
   * 年
   */
  year: string
}

/**
 * 获取校园账单
 * 获取充值记录和消费记录都是走这个接口，需要注意获取的消费总额默认是负数
 */
export const getCardHistory = async (params: CardHistoryParams) => {
  return request.get<CardHistoryData>('/pt/card-history', {
    data: params,
  })
}
