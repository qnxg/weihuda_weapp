export const isPlainObject = (value) => {
  if (value == null || typeof value !== 'object' || Object.prototype.toString.call(value) != '[object Object]') {
    return false;
  }
  if (Object.getPrototypeOf(value) === null) {
    return true;
  }
  let proto = value;
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }
  return Object.getPrototypeOf(value) === proto;
};

export interface FormattedDate {
  year: number;
  month: number;
  date: number;
  /**
   * 年月日
   */
  ymd: string;
  /**
   * 月日
   */
  md: string;
}

/**
 * 根据unix时间戳分析出年月日并把他们整合到一个对象中返回
 * @param time 时间戳
 * @returns {FormattedDate} 处理后的数据
 */
export const dateFormat = (time: number | string): FormattedDate => {
  if (typeof time === 'string') {
    time = +time;
  }
  const d = new Date(time);
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const date = d.getDate();
  const ymd = `${year}年${month}月${date}日`;
  const md = `${month}月${date}日`;
  return {
    year,
    month,
    date,
    ymd,
    md
  };
};
