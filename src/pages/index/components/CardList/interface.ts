export interface Data {
  curWeek?: number
  curDay?: number
}

export interface CardListProps {
  curDayAndWeek: Data
  /** 如果变化则重新获取首页数据 */
  fetchDataControl: any
  onFetchDataFinished: any
}
