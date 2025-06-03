import { View } from '@tarojs/components'
import { useCallback, useEffect } from 'react'
import style from './index.module.scss'
import { getJifenTotalApi } from '@/apis/jifen'
import Card from '@/components/Card'
import SignButton from '@/pages/jifen/components/Qiandao/SignButton'
import usePromise from '@/utils/hooks/usePromise'
import { fetchUserSettings } from '@/utils/storage/userSettings'
import type CardProps from '../../CardProps'

const getJifenNum = async () => (await getJifenTotalApi()).jifen

const SignInCard: React.FC<CardProps> = props => {
  // 首页的下拉刷新就不追踪签到按钮的加载状态了，因为签到按钮自己管理了加载状态。
  const { onLoadingStatusChange } = props
  const getSettings = useCallback(async () => (await fetchUserSettings()).indexSignInCardSettings, []);
  const [settings] = usePromise(
    getSettings,
    undefined,
    [props.reloadController]
  )
  const [jifen, loadingJifen, error] = usePromise(getJifenNum, NaN, [
    props.reloadController,
  ])
  useEffect(() => {
    onLoadingStatusChange(loadingJifen)
  }, [onLoadingStatusChange, loadingJifen])
  if (settings == undefined || !settings.show) {
    return <></>
  }
  return (
    <Card>
      <View className={style.container}>
        <View className={style.icon} />
        <View className={style.text}>
          当前积分：{loadingJifen || error ? '未知' : +jifen}
        </View>
        <SignButton className={style.button} key={props.reloadController} />
      </View>
    </Card>
  )
}

export default SignInCard
