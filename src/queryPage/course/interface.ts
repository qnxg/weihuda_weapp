export interface course {
  classID: string
  serial: string
  name: string
  examType: string
  className: string
  teacher: string
  people: number
  credit: number
  school: number
  place: string
  academy: string
}

export interface Hdjw {
  course: course[]
}

export interface RootObject {
  hdjw: Hdjw
}
