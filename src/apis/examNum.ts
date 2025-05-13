import request from './request';

/**
 * ExamNumItem，考号预存
 */
export interface ExamNumItem {
    /**
     * 时间
     */
    date: string;
    /**
     * id
     */
    id: number;
    /**
     * 名称
     */
    name: string;
    /**
     * 考号
     */
    num: string;
}


/**
 * 获取考号预存
 */
export const getExamNumList = async () => {
  return request.get<ExamNumItem[]>('/exam-num')
}


/**
 * 添加考号预存
 * @param data 新增的考号
 */
export const postExamNumApi = async (data: Omit<ExamNumItem, 'id'>) => {
  return request.post<string>('/exam-num', {
    data
  })
}

/**
 * 删除考号预存
 * @param id 考号预存id
 */
export const deleteExamNumApi = async (id: number) => {
  return request<string>({
    url: `/exam-num?id=${id}`,
    method: 'DELETE'
  })
}