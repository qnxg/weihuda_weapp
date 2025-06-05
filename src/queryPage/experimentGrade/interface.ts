export interface total {
  cj: string
  xs: string
}

export interface item {
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

export interface LabGrade {
  total: total
  items: item[]
}

export interface Pt {
  labGrade: LabGrade
}

export interface RootObject {
  pt: Pt
}
