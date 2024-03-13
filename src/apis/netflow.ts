import request from '@/utils/request'

/**
 * NetflowData，流量信息
 */
export interface NetflowData {
  /**
   * 欠费信息
   */
  payInfo: number
  /**
   * 本月流量信息
   */
  thisMonth: ThisMonthNetflow
  /**
   * 锁定状态
   */
  unlock: string
}

/**
 * NtflowOrderItem，流量历史账单
 */
export interface NtflowOrderItem {
  /**
   * 下载流量
   */
  downloadName: string
  /**
   * 月
   */
  month: string
  /**
   * 超额流量
   */
  realOverTraffic: number
  /**
   * 需要支付金额
   */
  shouldPay: number
  /**
   * 更新时间
   */
  updateTime: string
  /**
   * 上传流量
   */
  uploadName: string
}

/**
 * 本月流量信息
 */
export interface ThisMonthNetflow {
  /**
   * 已使用流量
   */
  all: string
  /**
   * 所有流量
   */
  allBasePackageAmount: number
  /**
   * 超出流量
   */
  allExtendPackageAmount: number
  /**
   * 已使用流量
   */
  basePackageUsed: number
  basePackageUsedPer: number
  /**
   * 下载
   */
  download: string
  extendPackageUsed: number
  extendPackageUsedPer: number
  surplusBasePackage: number
  surplusExtendPackage: number
  /**
   * 上传
   */
  upload: string
}

/**
 * 具体数据，请求失败时为null
 *
 * NetflowDetail，流量明细
 */
export interface NetflowDetail {
  /**
   * 总下载
   */
  AllDownload: number;
  /**
   * 总流量
   */
  AllTotal: number;
  /**
   * 总上传
   */
  AllUpload: number;
  /**
   * 流量列表
   */
  FloatDetailList: FloatDetailList[];
  UserCode: string;
}

export interface FloatDetailList {
  /**
   * 应用
   */
  App: string;
  /**
   * 下载
   */
  Download: number;
  Per: number;
  Total: number;
  Upload: number;
}

/**
 * 获取流量信息
 */
export const getNetflow = async () => {
  return request.get<NetflowData>('/netflow')
}
/**
 * 获取流量信息
 */
export const getNetflowOrder = async () => {
  return request.get<NtflowOrderItem[]>('/netflow/order')
}
/**
 * 月流量明细
 */
export const getNetflowMonth = async (year: number, month: number) => {
  return request.get<NetflowDetail>('/netflow/month-detail', {
    data: {
      year,
      month
    }
  })
}
/**
 * 日流量明细
 */
export const getNetflowDay = async (year: number, month: number, day: number) => {
  return request.get<NetflowDetail>('/netflow/day-detail', {
    data: {
      year,
      month,
      day
    }
  })
}
