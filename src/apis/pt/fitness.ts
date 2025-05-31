import request from '../request'

/**
 * 具体数据，请求失败时为null
 *
 * Fitness
 */
export interface Fitness {
  /**
   * 视力
   */
  eye: Eye
  /**
   * 体测项目
   */
  items: FitnessItem[]
  /**
   * 记录
   */
  // report: Report;
  /**
   * 学生信息
   */
  student: Student
  /**
   * 总分
   */
  total: Total
}

/**
 * 视力
 */
interface Eye {
  eye_ametropia_left: string
  eye_ametropia_right: string
  eye_mirror_left: string
  eye_mirror_right: string
  eyesight_left: string
  eyesight_right: string
}

/**
 * FitnessItem
 */
export interface FitnessItem {
  /**
   * 类型，green red
   */
  class: Class
  /**
   * 成绩
   */
  grade: number
  /**
   * 测试项名称
   */
  name: string
  /**
   * 评级
   */
  rank: string
  /**
   * 实际成绩
   */
  score: string
}

/**
 * 类型，green red
 */
enum Class {
  Green = 'green',
  Red = 'red',
}

/**
 * 学生信息
 */
interface Student {
  /**
   * 姓名
   */
  name: string
  /**
   * 学号
   */
  number: string
}

/**
 * 总分
 */
export interface Total {
  /**
   * 评级
   */
  grade: string
  /**
   * 成绩
   */
  score: number
}

/**
 * 获取体测成绩
 * @param xn 学年
 */
export const getFitness = async (xn: string | number) => {
  return request.get<Fitness>('/pt/fitness', {
    data: {
      xn,
    },
  })
}

/**
 * FitnessAppointItem，体测预约信息
 */
export interface FitnessAppointItem {
  /**
   * 预约说明
   */
  appo_desc: string
  /**
   * 班级
   */
  class_name: string
  /**
   * 预约日期
   */
  show_time: string
  /**
   * 状态
   */
  status: string
  /**
   * 测试时间
   */
  test_time: string
  /**
   * 测试项目
   */
  test_type: string
}

/**
 * 获取体测预约信息
 * @param xn 学年
 */
export const getFitnessAppoint = async () => {
  return request.get<FitnessAppointItem[]>('/pt/fitness-appoint')
}
