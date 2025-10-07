import { configureStore } from '@reduxjs/toolkit'
// 需要重构：循环依赖

import classTable from './classTable'
import semester from './semester'
import userInfo from './userInfo'

const store = configureStore({
  reducer: {
    userInfo,
    semester,
    classTable,
  },
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export default store
