import { configureStore } from '@reduxjs/toolkit'
import userInfo from './userInfo'
import classTable from './classTable'
import smester from './smester'

const store = configureStore({
  reducer: {
    userInfo,
    smester,
    classTable
  }
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export default store
