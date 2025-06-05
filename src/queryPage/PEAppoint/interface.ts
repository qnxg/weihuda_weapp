export interface Item {
  appo_desc: string
  show_time: string
  test_time: string
  test_type: string
  class_name: string
  status: string
}

export interface Pt {
  fitnessAppoint: Item[]
}

export interface RootObject {
  pt: Pt
}
