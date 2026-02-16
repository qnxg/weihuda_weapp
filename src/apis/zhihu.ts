import request from './request'

export interface IZhihu {
  /** id */
  id: number
  /** 标题 */
  title: string
  /** 类型 */
  typ: 'article' | 'link'
  /** 内容 */
  content: string
  /** 标签 */
  tags: string
  /** 封面 */
  cover?: string
  /** 状态 */
  status: 0 | 1 | 2
  /** 发布时间 */
  createdAt: string
  /** 学号 */
  stuId: string
  /** 是否置顶 */
  top: boolean
}

export function getZhihuItemLink(zhihuItem: IZhihu): string {
  if (zhihuItem.typ === 'link') {
    return `/pages/webview/index?url=${zhihuItem.content}&title=${zhihuItem.title}&from=zhihu`
  } else {
    return `/pages/detail/index?id=${zhihuItem.id}&title=${zhihuItem.title}&publishTime=${zhihuItem.createdAt}`
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
  typ?: string
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

export interface IZhihuTagItem {
  /** Tag的人类可读的名称 */
  label: string
  /** Tag的唯一标识符 */
  value: string
}

export const getZhihuTags = async () => {
  return request.get<IZhihuTagItem[]>('/zhihu/tags')
}
