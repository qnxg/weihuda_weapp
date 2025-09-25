import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import Taro from '@tarojs/taro'
import dayjs from 'dayjs'
import { type CourseInfo, getClassTable } from '@/apis/hdjw/classTable'
import { getClassStartDateApi } from '@/apis/semester'
import { onColors, onFontColors } from '@/utils/config'
import storage from '@/utils/storage/cache'
import type { RootState } from '.'
import type { PayloadAction } from '@reduxjs/toolkit'

export enum EDayType {
  sunday = '1',
  monday = '2',
  tuesday = '3',
  wednesday = '4',
  thursday = '5',
  friday = '6',
  saturday = '7',
}

export interface Semester {
  show: string
  xn: number
  xq: number
}

export interface StateType {
  semesters: Array<Semester>
  currentSem: number
  currentWeek: number
  mode: boolean
  currentStart: string
  classTable: Array<CourseInfo> // 总课表数据
}

const initialState: StateType = {
  semesters: [],
  currentSem: 0,
  currentWeek: 0,
  mode: false,
  currentStart: '',
  classTable: [],
}

/**
 * 进行课表基础数据的初始化
 *
 * 修改了
 * `semesters`
 * `currentSem`
 * `currentWeek`
 * `currentStart`
 * `mode`
 * `classTable`
 */
export const initClassTableThunk = createAsyncThunk(
  'classTable/initClassTable',
  async (_, thunkAPI) => {
    try {
      // 获取常量
      const termText: Array<string> = ['秋季学期', '春季学期', '夏季学期']
      const state = thunkAPI.getState() as RootState
      const { termYear, termStart, termType, weekNum } = state.semester
      const { enterYear } = state.userInfo
      const oldState = state.classTable

      // 计算学期
      const semesters: Array<Semester> = []
      // TODO 这里先进行特判，到了第三学期就先人为添加一个新学期，确保能够查看新课表。后续打算大力修改前端
      if (termType === 3) {
        semesters.unshift({
          show: `${termYear + 1}-${termYear + 2}学年秋季学期`,
          xn: termYear + 1,
          xq: 1,
        })
      }
      // 从当前学年开始倒序枚举到入学年份。有可能入学年份大于当前学年（新生），此时下界取 min，确保当前学年被加入
      for (let i = termYear; i >= Math.min(enterYear, termYear); --i) {
        for (let j = 3; j >= 1; --j) {
          semesters.push({
            show: `${i}-${i + 1}学年${termText[j - 1]}`,
            xn: i,
            xq: j,
          })
        }
      }
      // 计算周数分开学前后
      let tempWeekNum: number = dayjs().isBefore(termStart)
        ? weekNum - 1
        : weekNum + 1
      tempWeekNum = tempWeekNum > 18 ? 18 : tempWeekNum
      // 处理毕业生逻辑
      // let tempStart: string = termStart
      // console.log('semesters', semesters)
      // if (termYear !== semesters[0]!.xn) {
      //   tempStart = storage.getTermStart(semesters[0]!.xn, semesters[0]!.xq)
      //   tempWeekNum = 1
      // }
      const termConfig = storage.getTermConfig()
      // 生成基础信息
      const res: StateType = {
        ...oldState,
        semesters: semesters,
        currentSem: semesters.findIndex(
          item => item.xn == termYear && item.xq == termType
        ),
        currentWeek: tempWeekNum,
        currentStart: termStart,
        mode: storage.getTableMode() && true,
        classTable:
          storage.getClassTable(termConfig.year, termConfig.term) || [],
      }
      return res
    } catch (e) {
      console.log('初始化课表数据失败', e)
    }
  }
)

/**
 * 进行课表数据的更新
 */
export const refreshClassTableThunk = createAsyncThunk(
  'classTable/refreshClassTable',
  async (_, thunkAPI) => {
    // 获取常量
    const state = thunkAPI.getState() as RootState
    const { semesters, currentSem } = state.classTable
    const xn = semesters[currentSem]!.xn.toString()
    const xq = semesters[currentSem]!.xq
    await Taro.showLoading({
      title: '加载中...',
      mask: true,
    })
    try {
      const course = await getClassTable(xn, xq)
      // 基础染色索引
      let baseColorIndex = 0
      const colorMap: Map<string, number> = new Map()
      // 进行染色
      if (course) {
        course.map(item => {
          // 类型规范化
          item.day = parseInt(item.day.toString())
          // 进行染色
          let colorIndex: number
          if (colorMap.has(item.courseName)) {
            colorIndex = colorMap.get(item.courseName)!
          } else if (baseColorIndex > 9) {
            colorIndex = Math.round(Math.random() * 9)
            colorMap.set(item.courseName, colorIndex)
          } else {
            colorIndex = baseColorIndex
            colorMap.set(item.courseName, colorIndex)
            baseColorIndex++
          }
          item.bgColor = onColors[colorIndex]
          item.fontColor = onFontColors[colorIndex]
        })
      }
      // 进行数据缓存
      storage.setClassTable(+xn, xq, course)
      const startDate = await getClassStartDateApi(xn, xq)
      const start = startDate.replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3')
      storage.setTermStart(+xn, xq, start)
      Taro.hideLoading()
      return {
        classTable: course,
        currentStart: start,
      }
    } catch (error) {
      console.log(error)
      Taro.hideLoading()
    }
  }
)

const classTable = createSlice({
  name: 'classTable',
  initialState,
  reducers: {
    /**
     * 保存
     */
    save(state, { payload }: PayloadAction<Partial<StateType>>) {
      return {
        ...state,
        ...payload,
      }
    },
  },
  extraReducers(builder) {
    builder
      .addCase(initClassTableThunk.fulfilled, (_, action) => {
        return action.payload
      })
      .addCase(refreshClassTableThunk.fulfilled, (state, action) => {
        if (!action.payload) {
          return state
        }
        state.classTable = action.payload.classTable
        state.currentStart = action.payload.currentStart
      })
  },
})

export const { save: saveClassTable } = classTable.actions

export default classTable.reducer
