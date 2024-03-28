import { INotice, getNoticePageApi, putNoticeByIdApi } from '@/apis/notice'
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export interface StateType {
  total: number
  unread: number
  data: INotice[]
}

const initialState: StateType = {
  total: 0,
  unread: 0,
  data: []
}

/**
 * 请求消息通知
 */
export const fetchNoticeThunk = createAsyncThunk('notice/fetchNotice', async () => {
  const res = await getNoticePageApi({ page: 1, pageSize: 20 })
  if (res) {
    const newNotice = res.rows
      .map((item) => {
        if (item.btnConfig && typeof item.btnConfig === 'string') {
          item.btnConfig = JSON.parse(item.btnConfig).reverse()
        }
        return item
      })
    return {
      total: newNotice.length,
      unread: newNotice.filter((item) => item.status === 0).length,
      data: newNotice
    }
  }
})

// 更改消息通知
export const putNoticeByIdThunk = createAsyncThunk('notice/putNoticeById', async (payload: Partial<INotice>) => {
  const res = await putNoticeByIdApi(payload.id!, payload)
  if (res) {
    return payload
  }
})

export const notice = createSlice({
  name: 'notice',
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
      .addCase(fetchNoticeThunk.fulfilled, (_, action) => {
        return action.payload
      })
      .addCase(putNoticeByIdThunk.fulfilled, (state, { payload }) => {
        // 请求完成之后，更新数据
        if (!payload) return state
        const index = state.data.findIndex((item) => item.id === payload.id)
        if (index === -1) return state
        // 更新数据
        state.data[index] = {
          ...state.data[index],
          ...payload
        }
        // 更新未读数量
        state.unread = state.data.filter((item) => item.status === 0).length
      })
  }
})

export const { save: saveClassTable } = notice.actions

export default notice.reducer
