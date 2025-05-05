import { getClassStartDate, getClassTable } from '@/apis/hdjw/classTable'
import { multiArray, onColors } from '@/utils/config'
import storage from '@/utils/storage/cache'
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import Taro from '@tarojs/taro'
import dayjs from 'dayjs'
import { RootState } from '.'

export enum EDayType {
  sunday = '1',
  monday = '2',
  tuesday = '3',
  wednesday = '4',
  thursday = '5',
  friday = '6',
  saturday = '7'
}

export interface Semester {
  show: string
  xn: number
  xq: number
}

export interface Subject {
  /** 课程id */
  id: string
  /** 课程上课班级 */
  classId: string
  /** 课程名称 */
  classname: string
  /** 上课教室地点 */
  location: string
  /** 任课教师 */
  teachers: string
  /** 课程在哪些周会上 */
  week: string
  /** 课程在周几上 */
  day: number | string
  /** 课程在哪几节上 */
  section: string
  /** 课程类型（自定义或来自教务系统）'1' | '2' */
  type: number
  /** 课程备注信息 例如课程QQ群号 */
  skqk: string
  /** 背景颜色 */
  bgColor?: string
}

export interface StateType {
  semesters: Array<Semester>
  currentSem: number
  weeks: Array<string>
  currentWeeks: number
  currentWeek: number
  mode: boolean
  currentStart: string
  classTable: Array<Subject>
  showOptions: boolean
  showFloat: boolean
  floatData: Array<Subject>
}

const initialState: StateType = {
  semesters: [],
  currentSem: 0,
  weeks: multiArray[1],
  currentWeeks: 0,
  currentWeek: 0,
  mode: false,
  currentStart: '',
  classTable: [],
  showOptions: false,
  showFloat: false,
  floatData: []
}

/**
 * 进行课表基础数据的初始化
 */
export const initClassTableThunk = createAsyncThunk('classTable/initClassTable', async (_, thunkAPI) => {
  // 获取常量
  const termText: Array<string> = ['秋季学期', '春季学期', '夏季学期']
  const state = thunkAPI.getState() as RootState
  const { termYear, termStart, termType, weekNum } = state.smester
  const { enterYear } = state.userInfo
  const oldState = state.classTable
  // 计算学期
  const semesters: Array<Semester> = []
  for (let i = termYear; i >= enterYear; --i) {
    for (let j = 3; j >= 1; --j) {
      semesters.push({
        show: `${i}-${i + 1}学年${termText[j - 1]}`,
        xn: i,
        xq: j
      })
    }
  }
  // 计算周数分开学前后
  let tempWeekNum: number = dayjs().isBefore(termStart) ? weekNum - 1 : weekNum + 1
  tempWeekNum = tempWeekNum > 18 ? 18 : tempWeekNum
  // 处理毕业生逻辑
  let tempStart: string = termStart
  if (termYear !== semesters[0].xn) {
    tempStart = storage.getTermStart(semesters[0].xn, semesters[0].xq)
    tempWeekNum = 1
  }
  const termConfig = storage.getTermConfig()
  // 生成基础信息
  return {
    ...oldState,
    semesters: semesters,
    currentSem: semesters.findIndex((item) => item.xn == termYear && item.xq == termType),
    currentWeeks: tempWeekNum,
    currentWeek: tempWeekNum,
    currentStart: tempStart,
    mode: storage.getTableMode() && true,
    classTable: storage.getClassTable(termConfig.year, termConfig.term) || []
  }
})

/**
 * 进行课表数据的更新
 */
export const refreshClassTableThunk = createAsyncThunk('classTable/refreshClassTable', async (_, thunkAPI) => {
  // 获取常量
  const state = thunkAPI.getState() as RootState
  const { semesters, currentSem } = state.classTable
  const xn = semesters[currentSem].xn.toString()
  const xq = semesters[currentSem].xq
  Taro.showLoading({
    title: '加载中...',
    mask: true
  })
  try {
    const response = await getClassTable(xn, xq)
    // 基础染色索引
    let baseColorIndex = 0
    const colorMap = {}
    // 进行染色
    const course: Subject[] = response
    if (course) {
      course.map((item) => {
        // 类型规范化
        item.day = parseInt(item.day.toString())
        // 进行染色
        let colorIndex: number
        if (colorMap.hasOwnProperty(item.classname)) {
          colorIndex = colorMap[item.classname]
        } else if (baseColorIndex > 9) {
          colorIndex = Math.round(Math.random() * 9)
          colorMap[item.classname] = colorIndex
        } else {
          colorIndex = baseColorIndex
          colorMap[item.classname] = colorIndex
          baseColorIndex++
        }
        item.bgColor = onColors[colorIndex]
      })
    }
    // 进行数据缓存
    storage.setClassTable(+xn, xq, course)
    const startDate = await getClassStartDate(xn, xq)
    const start = startDate.replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3')
    storage.setTermStart(+xn, xq, start)
    Taro.hideLoading()
    return {
      classTable: course,
      currentStart: start
    }
  } catch (error) {
      console.log(error)
      Taro.hideLoading()
  }
})

export const classTable = createSlice({
  name: 'classTable',
  initialState,
  reducers: {
    /**
     * 保存
     */
    save(state, { payload }: PayloadAction<Partial<StateType>>) {
      return {
        ...state,
        ...payload
      }
    }
  },
  extraReducers(builder) {
    builder
      .addCase(initClassTableThunk.fulfilled, (_, action) => {
        return action.payload
      })
      .addCase(refreshClassTableThunk.fulfilled, (state, action) => {
        if(!action.payload) {
          return state
        }
        state.classTable = action.payload.classTable
        state.currentStart = action.payload.currentStart
      })
  }
})

export const { save: saveClassTable } = classTable.actions

export default classTable.reducer
