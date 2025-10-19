export interface GradeState {
  selectedXnIndex: number
  selectedXq: number
}

export interface Grade {
  name: string
  grade: number
  credit: number
  examType: string
  serial: string
}

export interface Hdjw {
  grade: Grade[]
}

export interface RootObject {
  hdjw: Hdjw
}
