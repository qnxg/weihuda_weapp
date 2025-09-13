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
 */
export const getMiniConfigPageApi = async (
  queryData: IMiniConfigPageQueryData
) => {
  return request.get<IMiniConfigPageResponseData>('/config', {
    data: queryData,
  })
}

export interface TagItem {
  /** Tag的人类可读的名称 */
  label: string
  /** Tag的唯一标识符 */
  value: string
}

/**
 * 获取前100个知湖Tag
 *
 * 以JSON格式返回
 */
export const getZhihuTagsJSON = async () => {
  const res = await getMiniConfigPageApi({
    page: 1,
    pageSize: 100,
    key: 'zhihuTags',
  })
  if (res.rows.length) {
    return res.rows[0]!.value
  } else {
    throw Error('获取知湖标签失败')
  }
}

/**
 * 获取前100个知湖Tag
 */
export const getZhihuTags = async () =>
  JSON.parse(await getZhihuTagsJSON()) as TagItem[]
