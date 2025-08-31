import arrangement from '@/static/toolBox/icon-arrangement.svg'
import borrow from '@/static/toolBox/icon-borrow.svg'
import computerTest from '@/static/toolBox/icon-computer-test.svg'
import courseInfo from '@/static/toolBox/icon-course-info.svg'
import electricity from '@/static/toolBox/icon-electricity.svg'
import empty from '@/static/toolBox/icon-empty.svg'
import examId from '@/static/toolBox/icon-exam-id.svg'
import experimentGrade from '@/static/toolBox/icon-experiment-grade.svg'
import experiment from '@/static/toolBox/icon-experiment.svg'
import grade from '@/static/toolBox/icon-grade.svg'
import mxsc from '@/static/toolBox/icon-mxsc.svg'
import netflowBill from '@/static/toolBox/icon-network-bill.svg'
import netflowDetail from '@/static/toolBox/icon-network-detail.svg'
import PEAppoint from '@/static/toolBox/icon-pe-appointment.svg'
import PEGrade from '@/static/toolBox/icon-pe-grade.svg'
import PEStandard from '@/static/toolBox/icon-pe-standard.svg'
// import peaceTime from '@/static/toolBox/icon-peacetime.svg'
import ranking from '@/static/toolBox/icon-ranking.svg'
import schoolCalendar from '@/static/toolBox/icon-school-calendar.svg'
// import selectResult from '@/static/toolBox/icon-select-result.svg';
import stuCard from '@/static/toolBox/icon-stu-card.svg'
import trend from '@/static/toolBox/icon-trend.svg'

/**
 * @interface GridTab 定义tab数据结构
 */
export interface GridTab {
  title: string
  imgUrl: string
  navigator: string
}

export interface Category {
  name: string
  member: GridTab[]
}

export const data: Category[] = [
  {
    name: '成绩与排名',
    member: [
      {
        title: '成绩查询',
        imgUrl: grade,
        navigator: '/queryPage/grade/index',
      },
      // {
      //   title: '项目成绩',
      //   imgUrl: peaceTime,
      //   navigator: '/queryPage/peaceTime/index',
      // },
      {
        title: '成绩排名',
        imgUrl: ranking,
        navigator: '/queryPage/ranking/index',
      },
      // {
      //   title: '成绩趋势',
      //   imgUrl: trend,
      //   navigator: '/queryPage/trend/index',
      // },
      {
        title: '实验成绩',
        imgUrl: experimentGrade,
        navigator: '/queryPage/experimentGrade/index',
      },
      {
        title: '体测成绩',
        imgUrl: PEGrade,
        navigator: '/queryPage/PEQuery/index',
      },
    ],
  },
  {
    name: '课程与考试',
    member: [
      {
        title: '课程信息',
        imgUrl: courseInfo,
        navigator: '/queryPage/course/index',
      },
      {
        title: '实验安排',
        imgUrl: experiment,
        navigator: '/queryPage/experimentArrange/index',
      },
      {
        title: '考试安排',
        imgUrl: arrangement,
        navigator: '/queryPage/examSchedule/index',
      },
      {
        title: '机考安排',
        imgUrl: computerTest,
        navigator: '/queryPage/computerTest/index',
      },
      {
        title: '体测预约',
        imgUrl: PEAppoint,
        navigator: '/queryPage/PEAppoint/index',
      },
      {
        title: '考号预存',
        imgUrl: examId,
        navigator: '/queryPage/examId/index',
      },
    ],
  },
  {
    name: '校园与生活',
    member: [
      {
        title: '校历查看',
        imgUrl: schoolCalendar,
        navigator: '/queryPage/schoolCalendar/index',
      },
      {
        title: '体测标准',
        imgUrl: PEStandard,
        navigator: '/queryPage/PEStandard/index',
      },
      {
        title: '借阅查询',
        imgUrl: borrow,
        navigator: '/queryPage/borrowInfo/index',
      },
      {
        title: '空教室查询',
        imgUrl: empty,
        navigator: '/queryPage/emptyRoom/index',
      },
      {
        title: '校园卡账单',
        imgUrl: stuCard,
        navigator: '/queryPage/card/index',
      },
      {
        title: '校园网账单',
        imgUrl: netflowBill,
        navigator: '/queryPage/netflowOrder/index',
      },
      {
        title: '流量详情',
        imgUrl: netflowDetail,
        navigator: '/queryPage/netflowDetail/index',
      },
      {
        title: '电费查询',
        imgUrl: electricity,
        navigator: '/queryPage/electricity/index',
      },
      {
        title: '萌新手册',
        imgUrl: mxsc,
        navigator: '/pages/webview/index?url=https://qnxg.cn/mxsc/book/',
      },
      // {
      //   title: '电费历史',
      //   imgUrl: electricityHistory,
      //   navigator: '/queryPage/electricityHistory/index'
      // }
    ],
  },
]
