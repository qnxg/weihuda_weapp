export interface Data {
  curWeek?: number
  curDay?: number
}

export interface CardListProps {
  curDayAndWeek: Data
  isInit: boolean
  /** 如果变化则重新获取首页数据 */
  fetchDataListener: any
  onFetchDataFinished: any
}
