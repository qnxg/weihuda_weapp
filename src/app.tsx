import Taro from '@tarojs/taro'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import React from 'react'
import { Provider } from 'react-redux'
import './app.scss'
import store from './models'
import './theme.css'

dayjs.extend(customParseFormat)

Taro.onPageNotFound(() => {
  Taro.redirectTo({ url: '/pages/404/index' })
})

const App: React.FC = ({ children }: React.PropsWithChildren) => {
  return <Provider store={store}>{children}</Provider>
}

export default App
