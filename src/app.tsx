import Taro, { useLaunch } from '@tarojs/taro'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import './app.scss'
import './theme.css'

const App: React.FC = ({ children }: React.PropsWithChildren) => {
  useLaunch(_options => {
    dayjs.extend(customParseFormat)

    Taro.onPageNotFound(() => {
      void Taro.redirectTo({ url: '/pages/404/index' })
    })
  })
  return children
}

export default App
