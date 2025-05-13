import request from './request'

export interface Dormitory {
  park: string
  build: string
  room: string
}

export const getDormitoryApi = async () => {
  return request.get<Dormitory | null>('/dormitory/query')
}

export const updateDormitoryApi = async () => {
  await request.get('/dormitory/update')
}

export const getElectricityApi = async (refresh = false) => {
  return request.get<string>('/electricity?refresh=' + (refresh ? 1 : 0))
}
