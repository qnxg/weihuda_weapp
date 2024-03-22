import request from '@/utils/request'
import { IPageQueryData } from './interface'

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

export interface IJifenRecordPageQueryData extends IPageQueryData, Partial<IJifenRecord> {}

/**
 * 获取总积分
 */
export const getJifenTotalApi = async () => {
  return request.get<number>('/jifen/total')
}

/**
 * 获取积分记录
 */
export const getJifenRecordApi = async (queryData: IJifenRecordPageQueryData) => {
  return request.get<IJifenRecordPageResponseData>('/jifen/record', {
    data: queryData
  })
}

/**
 * 新增积分记录
 */
export const postJifenRecordApi = async (postData: Partial<IJifenRecord>) => {
  return request.post<IJifenRecordPageResponseData>('/jifen', {
    data: postData
  })
}
