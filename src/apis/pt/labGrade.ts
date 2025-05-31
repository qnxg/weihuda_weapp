import request from '../request'

interface Items {
  grade: string
  grade_bg: string
  grade_cz: string
  grade_kq: string
  grade_yx: string
  labdate: string
  labname: string
  labtime: string
  labtype: string
  xs: string
}

interface Total {
  cj: string
  xs: string
}

export interface LabGradeData {
  total: Total
  items: Items[]
}

/**
 * 获取实验成绩
 * @param labId 实验编号
 */
export const getLabGrade = async (labId: number) => {
  return request.get<LabGradeData>('/pt/lab-grade', {
    data: {
      labId,
    },
  })
}
