export interface OrderObject {
  AddTime: string;
  AllowOverTraffic: number;
  BaseTraffic: number;
  Download: number;
  DownloadName: string;
  ExtTraffic: number;
  Month: string;
  PayOrderCode: string | null;
  PayState: number; // 1:已支付 0:未支付
  RealOverTraffic: number;
  ShouldPay: number;
  Total: number;
  UpdateTime: string;
  Upload: number;
  UploadName: string;
  Year: string;
}

export interface Chart {
  Month: string[];
  Upload: number[];
  Download: number[];
}

export interface Netflow {
  order: OrderObject[];
}

export interface RootObject {
  netflow: Netflow;
}
