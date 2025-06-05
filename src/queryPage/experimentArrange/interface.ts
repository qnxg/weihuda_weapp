export interface LabArrange {
  classname: string
  classtype: string
  date: string
  time: string
  week: string
  name: string
  place: string
  finished?: number
}

export interface Pt {
  labArrange: LabArrange[]
}

export interface RootObject {
  pt: Pt
}
