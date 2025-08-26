// import request from '../request'

// /**
//  * RawGradeItem，项目成绩
//  */
// export interface RawGradeItem {
//   /**
//    * 成绩项目列表
//    */
//   item: Item[]
//   /**
//    * 课程名称
//    */
//   name: string
// }

// interface Item {
//   /**
//    * 成绩
//    */
//   grade: number
//   /**
//    * 项目名称
//    */
//   name: string
// }

// /**
//  * 获取项目成绩
//  * @param xn 学年
//  * @param xq 学期
//  */
// export const getRawGrade = async (xn: string | number, xq: string | number) => {
//   return request.get<RawGradeItem[]>('/hdjw/raw-grade', {
//     data: {
//       xn,
//       xq,
//     },
//   })
// }
