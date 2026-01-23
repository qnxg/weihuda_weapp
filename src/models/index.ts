import { configureStore } from '@reduxjs/toolkit'
import classTable from './classTable'

const store = configureStore({
  reducer: {
    classTable,
  },
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export default store
