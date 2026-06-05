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

    const updateManager = Taro.getUpdateManager()

    updateManager.onUpdateReady(async function () {
      await Taro.showModal({
        showCancel: false,
        title: '更新提示',
        content: '新版本已下载，请重启应用',
        success(res) {
          if (res.confirm) {
            updateManager.applyUpdate()
          }
        },
      })
    })

    updateManager.onUpdateFailed(async function () {
      await Taro.showModal({
        showCancel: false,
        title: '更新提示',
        content: '有新版本但下载失败',
      })
    })
  })
  return children
}

export default App
