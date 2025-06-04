import { View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useCallback, useEffect, useState } from 'react'
import style from './index.module.scss'
import { getJifenTotalApi } from '@/apis/jifen'
import { getZhihuItemLink, getZhihuPageApi } from '@/apis/zhihu'
import Card from '@/components/Card'
import SignButton from '@/pages/jifen/components/Qiandao/SignButton'
import usePromise from '@/utils/hooks/usePromise'
import { fetchUserSettings } from '@/utils/storage/userSettings'
import type CardProps from '../../CardProps'

const getJifenNum = async () => (await getJifenTotalApi()).jifen

const getRecentZhihu = async () =>
  (await getZhihuPageApi({ page: 1, pageSize: 3, tags: '' })).rows


const SignInCardMorePart: React.FC = () => {
  const [moreThings, loadingMoreThings, error] =
    usePromise(getRecentZhihu, [], [])

  return (loadingMoreThings || error || moreThings.length == 0) ? <></> :
    <View className={style.more}>
      查看最新推文，获取更多积分吧：
      {moreThings.map(v => (
        <View
          className={style.zhihuItem}
          key={v.id}
          onClick={() => void Taro.navigateTo({ url: getZhihuItemLink(v) })}
        >
          {v.title}
        </View>
      ))}
    </View>
}

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

  const [showMore, setShowMore] = useState(false);

  if (settings == undefined || !settings.show) {
    return <></>
  }

  return (
    <Card className={style.card}>
      <View className={style.baseLineContainer}>
        <View className={style.icon} />
        <View className={style.text}>
          当前积分：{loadingJifen || error ? '未知' : +jifen}
        </View>
        <SignButton
          className={style.button}
          key={props.reloadController}
          signActionCallback={() => {
            if (settings.showHintAfterSignIn) { setShowMore(true) }
          }}
        />
      </View>
      {showMore ? <SignInCardMorePart /> : <></>}
    </Card>
  )
}

export default SignInCard
