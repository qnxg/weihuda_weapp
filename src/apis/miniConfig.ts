import request from './request'
import type { IPageQueryData } from './interface'

export interface IMiniConfig {
  /** id */
  id: number
  /** key */
  key: string
  /** valueType */
  valueType: string
  /** value */
  value: string
  /** 描述 */
  description: string
  /** 启用 */
  enabled: number
}

export interface IMiniConfigPageResponseData {
  count: number
  rows: IMiniConfig[]
}

export interface IMiniConfigPageQueryData
  extends IPageQueryData,
    Partial<IMiniConfig> {}

/**
 * 获取小程序配置列表分页
 * 
 * TODO: DELETE THIS API
 * 
 * @deprecated
 */
export const getMiniConfigPageApi = async (
  queryData: IMiniConfigPageQueryData
) => {
  return request.get<IMiniConfigPageResponseData>('/config', {
    data: queryData,
  })
}