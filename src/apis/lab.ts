import request from './request'

export interface LabArrange {
  seat: string
  name: string
  course: string
  teacher: string
  week: number
  day: string
  date: string
  time: string
  place: string
  phone?: string
  email?: string
}

export interface LabSetPasswordRes {
  success: boolean
  /** 失败时的错误信息，成功时为 undefined */
  msg?: string
}

export const getLabArrange = async () => {
  return request.get<LabArrange[] | null>('/lab/list')
}

export const setLabPassword = async (password: string) => {
  return request.post<LabSetPasswordRes>('/lab/setPassword', {
    data: {
      password,
    },
  })
}

export interface LabSemInfo {
  xn: number
  xq: number
  id: string
}

export const getLabSemInfo = async () => {
  return request.get<LabSemInfo[] | null>('/lab/sem_info')
}

export interface LabGrade {
  course_name: string
  course_score?: string
  labs: LabScoreItem[]
}

export interface LabScoreItem {
  lab_name: string
  lab_score: string
  attendance?: string
  details: LabScoreDetailItem[]
}

export interface LabScoreDetailItem {
  name: string
  score: string
}

export const getLabGrade = async (sem_id: string) => {
  return request.get<LabGrade | null>('/lab/grade', {
    data: {
      sem_id,
    },
  })
}

export interface VirtualLabGrade {
  lab_name: string
  lab_score: string
}

export const getVirtualLabGrade = async () => {
  return request.get<VirtualLabGrade[] | null>('/lab/virtual_grade')
}
