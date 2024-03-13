export interface history {
  TranCount: number;
  total: number;
  items: Item[];
}

export interface Item {
  tranAmt: string;
  effectDate: string;
  nowAmt: string;
  tranLocation: string;
  tranname: string;
  jourDate: string;
  jourName: string;
  jourNum: number;
}

export interface card {
  history: history;
}

export interface Pt {
  card: card;
}

export interface RootObject {
  pt: Pt;
}
