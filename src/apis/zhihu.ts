import request from './request'
import type { IPageQueryData } from './interface'

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

export interface IZhihuPageResponseData {
    count: number
    rows: IZhihu[]
}

export interface IZhihuPageQueryData extends IPageQueryData, Partial<IZhihu> {}

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
