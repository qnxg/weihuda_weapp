export interface Report {
  arithmeticAvg: number
  arithmeticAvgRank: number
  coreArithmeticAvg: number
  coreArithmeticAvgRank: number
  coreWeightAvg: number
  coreWeightAvgRank: number
  GPA: number
  GPARank: number
  weightAvg: number
  weightAvgRank: number
}

export interface Item {
  coreWeightAvg: string
  coreWeightAvgRank: string
  GPA: number
  GPARank: number
  weightAvg: number
  weightAvgRank: number
  name: string
}

export interface Semester {
  items: Item[]
  year: string
}

export interface Analyze {
  report: Report
  semester: Semester[]
}

export interface Hdjw {
  analyze: Analyze
}

export interface RootObject {
  hdjw: Hdjw
}
