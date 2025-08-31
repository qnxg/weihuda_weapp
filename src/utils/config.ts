/**
 * @interface CourseNum 课程时间与id对应关系字典
 */
export interface CourseNum {
  id: number // 节次
  startTime: string // 开始时间
  endTime: string // 结束时间
}

/**
 * @interface BuildingObject 楼栋信息
 */
export interface BuildingObject {
  building: string // 楼名
  id: string // 楼栋id
}

// 校内楼栋信息
export const buildingInfo = [
  { building: '综合楼', id: '106' },
  { building: '研究生楼', id: '302' },
  { building: '复临舍', id: '102' },
  { building: '中楼', id: '123' },
  { building: '东楼', id: '122' },
  { building: '梯教(北校区)', id: '201' },
  { building: '二教楼(北校区)', id: '202' },
  { building: '电子楼(北校区)', id: '203' },
  { building: '水上教学楼(北校区)', id: '204' },
  { building: '综合楼机房', id: 'W134b2a60000WH' },
  { building: '南楼', id: '117' },
  { building: '北楼', id: '121' },
  { building: '二院', id: 'W13463510000WH' },
  { building: '天马园区排练厅', id: 'W1343d740000WH' },
  { building: '物理院楼', id: 'W134153a0000WJ' },
  { building: '数学院楼', id: 'W134153a0000WK' },
  { building: '生物院楼', id: 'W13463550000WH' },
  { building: '工训中心', id: '132' },
  { building: '工训中心B栋', id: 'W1343be60000WH' },
  { building: '工训中心C栋', id: 'W1343cb40000WH' },
  { building: '工训中心D栋', id: 'W1343dd90000WJ' },
  { building: '工训中心E栋', id: 'W1343dd90000WH' },
  { building: '工训中心F栋', id: 'W1343dd90000WI' },
  { building: '工管院院楼', id: '115' },
  { building: '信科院院楼(软件大楼)', id: '105' },
  { building: '法学楼', id: '125' },
  { building: '机械院院楼', id: '129' },
  { building: '电气院院楼', id: '130' },
  { building: '建筑学院', id: '131' },
  { building: '生物院U型楼', id: 'W134153a0000WH' },
  { building: '岳麓书院', id: 'W134153a0000WI' },
  { building: '材料院楼', id: 'W134153a0000WL' },
  { building: '外语院楼', id: 'W134153a0000WM' },
  { building: '土木院楼', id: 'W134153a0000WN' },
  { building: '公共管理学院楼', id: 'W1348a680000WH' },
  { building: '马院院楼', id: 'W1348ab90000WH' },
  { building: '环境馆', id: 'W13415380000WH' },
  { building: '培训小楼(文学院)', id: 'W13415380000WI' },
  { building: '继教综合楼', id: '127' },
  { building: '工程实验大楼', id: '128' },
  { building: '逸夫楼', id: '133' },
  { building: '化学实验中心', id: 'W13416c50000WH' },
  { building: '办公楼', id: '101' },
  { building: '南校区图书馆', id: '134' },
  { building: '桃子湖教学区', id: '135' },
  { building: '四合院子', id: 'W13414dd0000WH' },
  { building: '麓谷湖大科技园', id: 'W1343be60000WI' },
  { building: '校外实验实践场所', id: 'W1343cab0000WH' },
  { building: '经贸大楼（北校区）', id: 'W1348a6d0000WH' },
  { building: '财院校区排练厅（北校区）', id: 'W134634f0000WH' },
  { building: '中四栋', id: 'W13463550000WI' },
  { building: '艺术教育中心', id: 'W13417fe0000WH' },
  { building: '南校区体育馆', id: '126' },
]

// 课程节次对应的时间
export const courseTime: Array<CourseNum> = [
  {
    id: 0,
    startTime: '',
    endTime: '',
  },
  {
    id: 1,
    startTime: '08:00',
    endTime: '08:45',
  },
  {
    id: 2,
    startTime: '08:55',
    endTime: '09:40',
  },
  {
    id: 3,
    startTime: '10:00',
    endTime: '10:45',
  },
  {
    id: 4,
    startTime: '10:55',
    endTime: '11:40',
  },
  {
    id: 5,
    startTime: '14:30',
    endTime: '15:15',
  },
  {
    id: 6,
    startTime: '15:15',
    endTime: '16:00',
  },
  {
    id: 7,
    startTime: '16:10',
    endTime: '16:55',
  },
  {
    id: 8,
    startTime: '16:55',
    endTime: '17:40',
  },
  {
    id: 9,
    startTime: '19:00',
    endTime: '19:45',
  },
  {
    id: 10,
    startTime: '19:55',
    endTime: '20:40',
  },
  {
    id: 11,
    startTime: '20:50',
    endTime: '21:35',
  },
  {
    id: 12,
    startTime: '21:35',
    endTime: '22:20',
  },
]

export const weekdayText: Array<string> = [
  '日',
  '一',
  '二',
  '三',
  '四',
  '五',
  '六',
]

// TODO 后续打算将学期周数改为从后端动态获取
export const semesterWeekNum = 18 // 学期周数

export const months: Array<string> = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
]

export const onColors: Array<string> = [
  '#E6F4FF',
  '#FDEBDD',
  '#DEFBF7',
  '#EEEDFF',
  '#FCEBCD',
  '#FFEFF0',
  '#EAF2FF',
  '#FFEEF8',
  '#FAEDFF',
  '#FFF9C9',
]

export const onFontColors: Array<string> = [
  '#08A0E2',
  '#E97055',
  '#3CB3C9',
  '#7D7CDD',
  '#FF9900',
  '#DD5D75',
  '#5D8FF8',
  '#EC6DB8',
  '#B769DF',
  '#CBA715',
]

export const offColor = '#efefef'
export const offFontColor = '#aeaeae'

export const addCoursePicker: Array<Array<string>> = [
  ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
  [
    '第1节',
    '第2节',
    '第3节',
    '第4节',
    '第5节',
    '第6节',
    '第7节',
    '第8节',
    '第9节',
    '第10节',
    '第11节',
    '第12节',
  ],
  [
    '第1节',
    '第2节',
    '第3节',
    '第4节',
    '第5节',
    '第6节',
    '第7节',
    '第8节',
    '第9节',
    '第10节',
    '第11节',
    '第12节',
  ],
]
