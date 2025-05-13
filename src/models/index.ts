import { configureStore } from '@reduxjs/toolkit'
// 需要重构：循环依赖
// eslint-disable-next-line import/no-cycle
import classTable from './classTable'
import notice from './notice'
import smester from './smester'
import userInfo from './userInfo'

const store = configureStore({
  reducer: {
    userInfo,
    smester,
    classTable,
    notice
  }
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export default store
