// 拉取数据 Graphql 字段
export interface ExamNum {
  date: string
  id: number
  name: string
  num: string
}

export interface Info {
  examNum: ExamNum[]
}

export interface RootObject {
  info: Info
}

/**
 * @interface ExamId
 * 考试名称
 * 准考证号
 * 考试时间
 */
export interface ExamId {
  examName: string
  examId: string
  examDate: string
  sub: string
  keyId: number
}
