import { getMiniConfigPageApi } from './miniConfig'
import request from './request'

export interface IZhihu {
  /** id */
  id: number
  /** 标题 */
  title: string
  /** 类型 */
  type: 'article' | 'link'
  /** 内容 */
  content?: string | null
  /** 标签 */
  tags: string
  /** 封面 */
  cover: string | null
  /** 状态 */
  status: 0 | 1 | 2
  /** 发布时间 */
  publishTime: string
  /** 学号 */
  stuId: string
}

export function getZhihuItemLink(zhihuItem: IZhihu): string {
  if (zhihuItem.type === 'link') {
    return `/pages/webview/index?url=${zhihuItem.content}&title=${zhihuItem.title}&from=zhihu`
  } else {
    return `/pages/detail/index?id=${zhihuItem.id}&title=${zhihuItem.title}&publishTime=${zhihuItem.publishTime}`
  }
}

export interface IZhihuPageResponseData {
  count: number
  rows: IZhihu[]
}

export interface IZhihuPageQueryData {
  /**
   * 要请求的条目的起始序号（以0开始）
   *
   * 序号越小，条目越新
   */
  offset: number
  /**
   * 请求的条目数量
   */
  req_count: number
  title?: string
  type?: string
  tags?: string
}

/**
 * 获取知湖文章列表分页
 */
export const getZhihuPageApi = async (queryData: IZhihuPageQueryData) => {
  return request.get<IZhihuPageResponseData>('/zhihu', {
    data: queryData,
  })
}

/**
 * 根据 id 获取知湖文章
 */
export const getZhihuByIdApi = async (id: number) => {
  return request.get<IZhihu>(`/zhihu/${id}`)
}

/**
 * 新增知湖文章
 */
export const postZhihuApi = async (postData: Partial<IZhihu>) => {
  return request.post<IZhihuPageResponseData>('/zhihu', {
    data: postData,
  })
}

/**
 * 编辑知湖文章
 */
export const putZhihuByIdApi = async (id: number, putData: Partial<IZhihu>) => {
  return request.put<IZhihuPageResponseData>(`/zhihu/${id}`, {
    data: putData,
  })
}

// /**
//  * 删除知湖文章
//  */
// export const deleteZhihuByIdApi = async (id: number) => {
//     return request.delete<string>(`/zhihu/${id}`)
// }


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
  // eslint-disable-next-line @typescript-eslint/no-deprecated
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
