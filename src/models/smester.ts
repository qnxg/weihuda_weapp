import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import Taro from '@tarojs/taro'
import dayjs from 'dayjs'
import { getSmesterInfo } from '@/apis/info'
import { dayOfWeek, nowWeek } from '@/utils/day'
import storage from '@/utils/storage/cache'
import type { PayloadAction} from '@reduxjs/toolkit';

/**
 * SmesterInfo，本学期信息
 */
export interface StateType {
  /**
   * 学习开始时间
   */
  termStart: string
  /**
   * 第几学期
   */
  termType: number | null
  /**
   * 学年
   */
  termYear: number
  /**
   * 第几周
   */
  weekNum: number
  /**
   * 星期几
   */
  dayOfWeek: number
}

export const getSmesterInfoThunk = createAsyncThunk('smester/getSmesterInfo', async () => {
  // 学期配置
  let termConfig = storage.getTermConfig()
  // 学期是否已结束
  let isOverdue = false

  // 判断是否需要重新获取学期配置
  if (termConfig) {
    // 是否学期末
    let overDueTerm = dayjs(new Date()).diff(dayjs(termConfig.start), 'week') >= 17
    // 小学期特判
    if (termConfig.term === 3) {
      overDueTerm = dayjs(new Date()).diff(dayjs(termConfig.start), 'week') >= 11
    }

    isOverdue = overDueTerm
  } else {
    // Taro.clearStorageSync()
  }

  // 无缓存或者当前缓存的学期已过期
  if (!termConfig || isOverdue) {
    await Taro.showLoading({
      title: '加载中...',
      mask: true
    })
    const smesterInfo = await getSmesterInfo()
    // 规范化数据
    termConfig = {
      term: smesterInfo.term,
      year: smesterInfo.year,
      start: smesterInfo.startDate
    }
    storage.setTermConfig(termConfig)
  }

  return {
    termStart: termConfig.start,
    termType: termConfig.term,
    termYear: termConfig.year,
    weekNum: nowWeek(termConfig.start),
    dayOfWeek: dayOfWeek()
  }
})

const initialState: StateType = {
  termStart: '2023-09-10',
  termType: null,
  termYear: 2023,
  weekNum: 0,
  dayOfWeek: 0
}

export const smesterSlice = createSlice({
  name: 'smester',
  initialState,
  reducers: {
    /**
     * 保存信息
     */
    save(state, { payload }: PayloadAction<StateType>) {
      state = {
        ...state,
        ...payload
      }
    }
  },
  extraReducers(builder) {
    builder.addCase(getSmesterInfoThunk.fulfilled, (_, action) => {
      return action.payload
    })
  }
})

export default smesterSlice.reducer
