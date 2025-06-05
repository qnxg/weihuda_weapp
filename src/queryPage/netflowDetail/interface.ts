export interface SelectorItem {
  name: string
  value: number
}

export interface LineData {
  c1: string
  c2: string
  data: string
}

export interface FloatDetailList {
  App: string
  Download: number
}

export interface FlowDetail {
  AllDownload: number
  FloatDetailList: FloatDetailList[]
}

export interface Netflow {
  monthDetail: FlowDetail
  dayDetail: FlowDetail
}

export interface MonthDetailObject {
  netflow: Netflow
}
