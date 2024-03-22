export default {
  pages: [
    'pages/jifen/index', // 积分中心
    'pages/information/index', // 知湖
    'pages/webview/index', // webview
    'pages/index/index', // 首页
    'pages/table/index', // 微课表
    'pages/mine/index', // 我的
    'pages/authConfirm/index', // 授权确认
    'pages/toolBox/index', // 工具箱
    'pages/detail/index', // 知湖文章详情
    // 'pages/lostFoundAdd/index', // 发布失物招领帖
    // 'pages/lostFoundDetail/index', // 失物招领帖详情
    'pages/addCourse/index', // 在课表里添加课程
    'pages/bind/index', // 绑定信息页面
    'pages/changeLog/index', // 我的-更新日志页面
    'pages/faq/index', // 近期热门问题
    'pages/messageBox/index', // 消息盒子
    'pages/feedback/index', // 反馈建议
    'pages/feedbackHistory/index', // 历史反馈查询
    'pages/noDuty/index', // 免责声明
    'pages/404/index', // 404页
  ],
  subPackages: [
    {
      root: 'queryPage',
      pages: [
        'grade/index', // 成绩查询
        'peaceTime/index', // 项目成绩查询
        'ranking/index', // 成绩排名
        'trend/index', // 成绩趋势
        'experimentGrade/index', // 物理实验成绩查询
        'PEQuery/index', // 体测成绩查询
        'PEQuery/eye', // 视力查询
        'course/index', // 课程信息查询
        'experimentArrange/index', // 物理实验安排查询
        'examSchedule/index', // 考试安排
        'computerTest/index', // 机考查询
        'PEAppoint/index', // 体测预约结果查询
        'examId/index', // 准考证预存
        'schoolCalendar/index', // 校历查看
        'PEStandard/index', // 体测标准
        'borrowInfo/index', // 图书借阅查询
        'emptyRoom/index', // 空教室查询
        'card/index', // 校园卡账单
        'card/detail', // 交易详情
        'netflowOrder/index', // 校园网流量账单
        'netflowDetail/index', // 校园网流量明细
        // 'electricityHistory/index', // 剩余电量历史记录
      ]
    }
  ],
  preloadRule: {
    'pages/index/index': {
      network: 'all',
      packages: ['queryPage']
    }
  },
  darkmode: true,
  themeLocation: 'theme.json',
  window: {
    navigationBarTitleText: '湖南大学微生活',
    navigationBarBackgroundColor: '@navBgColor',
    navigationBarTextStyle: '@navTextStyle',
    backgroundColor: '@bgColor',
    backgroundTextStyle: '@bgTextStyle',
    backgroundColorTop: '@bgColorTop',
    backgroundColorBottom: '@bgColorBottom'
  },
  tabBar: {
    color: '@tabFontColor',
    selectedColor: '@tabSelectedColor',
    backgroundColor: '@tabBgColor',
    borderStyle: '@tabBorderStyle',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '查湖',
        iconPath: '@iconHomePath',
        selectedIconPath: '@selectedIconHomePath'
      },
      {
        pagePath: 'pages/information/index',
        text: '知湖',
        iconPath: '@iconInfoPath',
        selectedIconPath: '@selectedIconInfoPath'
      },
      {
        pagePath: 'pages/toolBox/index',
        text: '工具箱',
        iconPath: '@iconToolPath',
        selectedIconPath: '@selectedIconToolPath'
      },
      {
        pagePath: 'pages/table/index',
        text: '课表',
        iconPath: '@iconTablePath',
        selectedIconPath: '@selectedIconTablePath'
      },
      {
        pagePath: 'pages/mine/index',
        text: '我的',
        iconPath: '@iconMinePath',
        selectedIconPath: '@selectedIconMinePath'
      }
    ]
  }
}
