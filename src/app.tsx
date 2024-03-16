import Taro from '@tarojs/taro'
import React from 'react'
import { Provider } from 'react-redux'
import './theme.css'
import './app.scss'
import store from './models'

Taro.onPageNotFound(() => {
  Taro.redirectTo({ url: '/pages/404/index' })
})

const App: React.FC = ({ children }: React.PropsWithChildren) => {
  return <Provider store={store}>{children}</Provider>
}

export default App
