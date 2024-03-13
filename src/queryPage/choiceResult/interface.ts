interface Credit {
  zxf: number;
  zxxf: number;
  fxxf: number;
}

interface Result {
  name: string;
  number: string;
  type: string;
  serial: string;
  choiceType: string;
  status: string;
  credit: number;
  school: number;
  time: string;
}

export interface Choice {
  credit: Credit;
  result: Result[];
}

export interface Hdjw {
  choice: Choice;
}

export interface RootObject {
  hdjw: Hdjw;
}
