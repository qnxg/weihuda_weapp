export interface GradeState {
  currentYear: number;
  currentSemester: number;
  isNotStart: boolean;
}

export interface Grade {
  name: string;
  grade: number;
  credit: number;
  examType: string;
  serial: string;
}

export interface Hdjw {
  grade: Grade[];
}

export interface RootObject {
  hdjw: Hdjw;
}
