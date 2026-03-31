import { View } from '@tarojs/components'
import { useCallback, useEffect } from 'react'
import style from './index.module.scss'
import { getJifenTotalApi } from '@/apis/jifen'
import Card from '@/components/Card'
import SignButton from '@/pages/jifen/components/Qiandao/SignButton'
import usePromise from '@/utils/hooks/usePromise'
import useRefreshKey from '@/utils/hooks/useRefreshKey'
import useShowCount from '@/utils/hooks/useShowCount'
import { fetchUserSettings } from '@/utils/storage/userSettings'
import type CardProps from '../../CardProps'

/** 签到卡片 */
const SignInCard: React.FC<CardProps> = props => {
  // 首页的下拉刷新就不追踪签到按钮的加载状态了，因为签到按钮自己管理了加载状态。
  const { onLoadingStatusChange } = props
  const getSettings = useCallback(
    async () => (await fetchUserSettings()).indexSignInCardSettings,
    []
  )

  const showCnt = useShowCount()

  const [reloadJifenController, reloadJifenTrigger] = useRefreshKey()

  const [settings] = usePromise(getSettings, undefined, [
    getSettings,
    props.reloadController,
  ])

  const [jifen, loadingJifen, error] = usePromise(getJifenTotalApi, NaN, [
    getJifenTotalApi,
    props.reloadController,
    reloadJifenController,
    // 每次重新显示页面时刷新积分
    showCnt,
  ])

  useEffect(() => {
    onLoadingStatusChange(loadingJifen)
  }, [onLoadingStatusChange, loadingJifen])

  if (settings == undefined || !settings.show) {
    return <></>
  }

  return (
    <Card>
      <View className={style.baseLineContainer}>
        <View className={style.icon} />
        <View className={style.text}>
          当前积分：
          {(loadingJifen && Number.isNaN(jifen)) || error ? '未知' : +jifen}
        </View>
        <SignButton
          className={style.signInButton}
          key={props.reloadController}
          signActionCallback={() => reloadJifenTrigger()}
        />
      </View>
    </Card>
  )
}

export default SignInCard
