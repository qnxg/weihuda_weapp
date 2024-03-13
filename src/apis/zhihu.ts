import request from '@/utils/request'

/**
 * 具体数据，请求失败时为null
 */
export interface ResponseData {
  /**
   * 列表
   */
  content: ZhihuItem[]
  /**
   * 数量
   */
  count: number
}

/**
 * ZhihuItem
 */
export interface ZhihuItem {
  /**
   * 地点
   */
  address: string
  /**
   * 创建时间
   */
  create_time: string
  /**
   * 活动开始时间
   */
  date_begin: string
  /**
   * 编辑者
   */
  editor: string
  /**
   * id
   */
  id: string
  /**
   * 封面
   */
  image: string
  /**
   * 是否置顶
   */
  is_top: string
  /**
   * 标题
   */
  title: string
  /**
   * 类型，如活动，比赛等等
   */
  typetag: string
}

/**
 * 获取知乎列表
 * @param kind 类型，如活动，比赛等等
 * @param page 分页
 * @returns
 */
export const getZhihuList = async (kind: number, page: number) => {
  return request.get<ResponseData>('/zhihu', {
    data: {
      kind,
      page
    }
  })
}

/**
 * 获取失物招领列表
 * @param page 分页
 * @returns
 */
export const getLfArticleList = async (page: number) => {
  return request.get<ResponseData>('/lf-article', {
    data: {
      page
    }
  })
}
