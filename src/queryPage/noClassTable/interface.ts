export interface noTable {
  classID: string;
  serial: string;
  name: string;
  examType: string;
  className: string;
  teacher: string;
  people: number;
  credit: number;
  school: number;
}

export interface Hdjw {
  noClasstable: noTable[];
}

export interface RootObject {
  hdjw: Hdjw;
}
