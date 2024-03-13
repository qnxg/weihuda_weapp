
export interface Library {
  borrowed: Borrowed[];
  borrowing: Borrowing[];
  finance: Finance[];
}

interface Borrowing {
  title: string;
  returnDate: string;
  author: string;
  publisher: string;
  renew: number;
}

interface Borrowed {
  title: string;
  time: string;
  author: string;
  type: string;
  publisher: string;
}

interface Finance {
  barcode: string;
  title: string;
  bookID: string;
  cost: number;
  feeType: string;
  library: string;
  paySign: string;
  payType: string;
  time: string;
  tranID: string;
}
