import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import Taro from '@tarojs/taro'
import { getUserInfoApi } from '@/apis/userInfo'
import storage from '@/utils/storage/cache'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface StateType {
  name: string
  stuId: string
  totalYear: number
  enterYear: number
  isBind: boolean
  sex: string
}

export const getUserInfoThunk = createAsyncThunk(
  'userInfo/getUserInfo',
  async () => {
    try {
      let userInfo = storage.getUserInfo()

      if (userInfo && userInfo.stuId) {
        userInfo.stuId = userInfo.stuId
        storage.setUserInfo(userInfo)
      }
      if (!userInfo) {
        const infoRes = await getUserInfoApi()
        if (infoRes && infoRes.xz !== null) {
          storage.setUserInfo(infoRes)
          userInfo = infoRes
        }
        Taro.hideLoading()
      }

      return {
        name: userInfo.name,
        stuId: userInfo.stuId,
        totalYear: userInfo.xz !== null ? userInfo.xz : 4,
        enterYear: userInfo.enter,
        sex: userInfo.sex,
        isBind: true,
      }
    } catch (error) {
      Taro.hideLoading()
      console.log(error)
    }
  }
)

const initialState: StateType = {
  name: '',
  stuId: '',
  totalYear: 4,
  enterYear: 2017,
  isBind: false,
  sex: '',
}

const userInfo = createSlice({
  name: 'userInfo',
  initialState,
  reducers: {
    /**
     * 保存用户信息
     */
    save(state, { payload }: PayloadAction<StateType>) {
      state = {
        ...state,
        ...payload,
      }
    },
  },
  extraReducers(builder) {
    builder.addCase(getUserInfoThunk.fulfilled, (_, action) => {
      return action.payload
    })
  },
})

export default userInfo.reducer
