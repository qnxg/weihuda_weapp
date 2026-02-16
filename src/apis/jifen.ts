import request from './request'
import type { IPageQueryData } from './interface'

export interface IJifenRecord {
  /** id */
  id: number
  /** key */
  key: string
  /** 参数 */
  param: string
  /** 学号 */
  stuId: string
  /** 描述 */
  desc: string
  /** 积分 */
  jifen: number
  /** 时间 */
  createdAt: string
}

/**
 * 获取总积分
 */
export const getJifenTotalApi = async () => {
  return request.get<number>('/jifen/total')
}

export interface IJifenRecordPageResponseData {
  count: number
  rows: IJifenRecord[]
}
export interface IJifenRecordPageQueryData
  extends IPageQueryData,
    Partial<Pick<IJifenRecord, 'key' | 'param'>> {}
/**
 * 获取积分记录
 */
export const getJifenRecordPageApi = async (
  queryData: IJifenRecordPageQueryData
) => {
  return request.get<IJifenRecordPageResponseData>('/jifen/record', {
    data: queryData,
  })
}

/**
 * 新增积分记录
 * 目前只用在了签到获取积分那里
 */
export const postJifenRecordApi = async (
  postData: Partial<Pick<IJifenRecord, 'key' | 'param'>>
) => {
  return request.post<number>('/jifen', {
    data: postData,
  })
}

/**
 * 阅读文章获取积分，（webview页面的阅读事件除了现在用来获得积分外，未来
 * 还有可能用来统计用户的阅读行为，比如阅读时长，阅读次数等，所以单独提取出来一个请求）
 */
export const getJifenWebviewReadApi = async (queryData: { url: string }) => {
  return request.get<number>('/jifen/webview-read', {
    data: queryData,
  })
}

export interface IJifenGoods {
  /** id */
  id: number
  /** 名称 */
  name: string
  /** 图片 */
  cover: string
  /** 数量 */
  count: number
  /** 价格 */
  price: number
  /** 描述 */
  description: string
  /** 启用 */
  enabled: boolean
}

export interface IJifenGoodsPageResponseData {
  count: number
  rows: IJifenGoods[]
}

export interface IJifenGoodsPageQueryData
  extends IPageQueryData,
    Partial<Pick<IJifenGoods, 'name'>> {}

/**
 * 获取积分奖品列表分页
 */
export const getJifenGoodsPageApi = async (
  queryData: IJifenGoodsPageQueryData
) => {
  return request.get<IJifenGoodsPageResponseData>('/jifen/goods', {
    data: queryData,
  })
}

export interface IJifenRule {
  /** id */
  id: number
  /** key */
  key: string
  /** 名称 */
  name: string
  /** 积分 */
  jifen: number
  /** 周期（天） */
  cycle: number
  /** 奖励次数上限 */
  maxCount: number
  /** 是否展示在兑换页面 */
  isShow: boolean
}

export interface IJifenRulePageResponseData {
  count: number
  rows: IJifenRule[]
}

export interface IJifenRulePageQueryData
  extends IPageQueryData,
    Partial<Pick<IJifenRule, 'key' | 'name'>> {}

/**
 * 获取积分规则列表分页
 */
export const getJifenRulePageApi = async (
  queryData: IJifenRulePageQueryData
) => {
  return request.get<IJifenRulePageResponseData>('/jifen/rules', {
    data: queryData,
  })
}

export interface IGoodsExchangeRecord {
  /** id */
  id: number
  /** 学号 */
  stuId: string
  /** 奖品id */
  goodsId: number
  /** 状态 */
  status: number
  /** 收货时间 */
  receiveTime?: string
  /** 兑换时间 */
  createdAt: string
}

export interface IGoodsExchangeRecordList {
  count: number
  rows: IGoodsExchangeRecord[]
}

/**
 * 获取兑换记录列表分页
 */
export const getGoodsExchangeRecordList = async (queryData: IPageQueryData) => {
  return request.get<IGoodsExchangeRecordList>('/jifen/exchange-record', {
    data: queryData,
  })
}

/**
 * 兑换奖品
 */
export const exchangeGoods = async (goodsId: number) => {
  return request.post<string>('/jifen/exchange-record', {
    data: { goodsId },
  })
}

export const getJifenDesc = async () => {
  return request.get<string>('/jifen/desc')
}
