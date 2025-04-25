import Taro, { useLaunch } from '@tarojs/taro'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import React from 'react'
import { Provider } from 'react-redux'
import './app.scss'
import store from './models'
import './theme.css'

const App: React.FC = ({ children }: React.PropsWithChildren) => {

  useLaunch((_options) => {

    dayjs.extend(customParseFormat)

    Taro.onPageNotFound(() => {
      Taro.redirectTo({ url: '/pages/404/index' })
    })

  });
  return <Provider store={store}>{children}</Provider>
}

export default App
