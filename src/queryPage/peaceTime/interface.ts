export interface State {
  currentYear: number
  currentTerm: number
}

export interface Item {
  name: string
  grade: number
}

export interface Raw {
  name: string
  item: Item[]
}

export interface Hdjw {
  raw: Raw[]
}

export interface RootObject {
  hdjw: Hdjw
}
