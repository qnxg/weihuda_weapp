export interface Data {
  curWeek?: number
  curDay?: number
}

export interface CardListProps {
  curDayAndWeek: Data
  isInit: boolean
  runRefereshFlag: any
  stopRefresh: any
}
