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
  createTime: string
}

export interface IJifenRecordPageResponseData {
  count: number
  rows: IJifenRecord[]
}

export interface IJifenRecordPageQueryData
  extends IPageQueryData,
    Partial<IJifenRecord> {}

/**
 * 获取总积分
 */
export const getJifenTotalApi = async () => {
  return request.get<Pick<IJifenRecord, 'jifen'>>('/jifen/total')
}

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
 * 新增积分记录（签到、等获取积分）
 */
export const postJifenRecordApi = async (postData: Partial<IJifenRecord>) => {
  return request.post<IJifenRecordPageResponseData>('/jifen', {
    data: postData,
  })
}

/**
 * 阅读文章获取积分，（webview页面的阅读事件除了现在用来获得积分外，未来
 * 还有可能用来统计用户的阅读行为，比如阅读时长，阅读次数等，所以单独提取出来一个请求）
 */
export const getJifenWebviewReadApi = async (queryData: { url: string }) => {
  return request.get<IJifenRecordPageResponseData>('/jifen/webview-read', {
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
}

export interface IJifenGoodsPageResponseData {
  count: number
  rows: IJifenGoods[]
}

export interface IJifenGoodsPageQueryData
  extends IPageQueryData,
    Partial<IJifenGoods> {}

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
  /** 启用 */
  enabled: number
}

export interface IJifenRulePageResponseData {
  count: number
  rows: IJifenRule[]
}

export interface IJifenRulePageQueryData
  extends IPageQueryData,
    Partial<IJifenRule> {}

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
export interface IGoodsRecord {
  /** id */
  id: number
  /** 学号 */
  stuId: string
  /** 奖品id */
  goodsId: number
  /** 兑换时间 */
  exchangeTime: string
  /** 状态 */
  status: number
  /** 收货时间 */
  receiveTime: string
  /** 备注 */
  comment: string
}

export interface IGoodsRecordPageResponseData {
  count: number
  rows: IGoodsRecord[]
}

export interface IGoodsRecordPageQueryData
  extends IPageQueryData,
    Partial<IGoodsRecord> {}

/**
 * 获取兑换记录列表分页
 */
export const getGoodsRecordPageApi = async (
  queryData: IGoodsRecordPageQueryData
) => {
  return request.get<IGoodsRecordPageResponseData>('/jifen/goods-record', {
    data: queryData,
  })
}

/**
 * 新增兑换记录（兑换奖品）
 */
export const postGoodsRecordApi = async (postData: Partial<IGoodsRecord>) => {
  return request.post<IGoodsRecordPageResponseData>('/jifen/goods-record', {
    data: postData,
  })
}
