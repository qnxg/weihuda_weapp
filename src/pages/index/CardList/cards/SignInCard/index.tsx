import { View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classNames from 'classnames'
import { useCallback, useEffect, useState } from 'react'
import style from './index.module.scss'
import { getJifenTotalApi } from '@/apis/jifen'
import { getZhihuItemLink, getZhihuPageApi } from '@/apis/zhihu'
import Button from '@/components/Button'
import Card from '@/components/Card'
import SignButton from '@/pages/jifen/components/Qiandao/SignButton'
import usePromise from '@/utils/hooks/usePromise'
import { fetchUserSettings } from '@/utils/storage/userSettings'
import { setNeedShowHintAfterSignIn } from '@/utils/storage/userSettings/customAccessors/SignInCardSettings'
import type CardProps from '../../CardProps'
import type { IZhihu } from '@/apis/zhihu';

const getJifenNum = async () => (await getJifenTotalApi()).jifen

const getRecentZhihu = async () =>
  (await getZhihuPageApi({ page: 1, pageSize: 3, tags: '' })).rows

const ZhihuItem: React.FC<{ izhihu: IZhihu }> = (props) => {
  const { izhihu } = props
  const [clicked, setClicked] = useState(false)
  return < View
    className={classNames(style.zhihuItem, { [style.clicked]: clicked })}
    onClick={() => {
      void Taro.navigateTo({ url: getZhihuItemLink(izhihu) })
      setClicked(true)
    }}
  >
    {izhihu.title}
  </View >
}

const SignInCardMorePart: React.FC<{
  onCollapseButtonClick: () => unknown,
  onNeverShowAgainButtonClick: () => unknown
}> = (props) => {
  const [moreThings, loadingMoreThings, error] =
    usePromise(getRecentZhihu, [], [])

  return (loadingMoreThings || error || moreThings.length == 0) ? <></> :
    <View className={style.more}>
      <View>
        查看最新推文，获取更多积分吧：
        {moreThings.map(v => (
          <ZhihuItem
            izhihu={v}
            key={v.id}
          />
        ))}
      </View>
      <View className={style.otherHints}>
        问题反馈/知湖投稿也有机会获得积分哟~
      </View>
      <View className={style.actionButtonLine}>
        <Button
          theme='plain'
          className={style.actionButton}
          onClick={props.onCollapseButtonClick}
        >
          折叠
        </Button>
        <Button
          theme='plain'
          className={style.actionButton}
          onClick={props.onNeverShowAgainButtonClick}
        >
          不再显示
        </Button>
      </View>
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
    <Card>
      <View className={style.baseLineContainer}>
        <View className={style.icon} />
        <View className={style.text}>
          当前积分：{loadingJifen || error ? '未知' : +jifen}
        </View>
        <SignButton
          className={style.signInButton}
          key={props.reloadController}
          signActionCallback={() => {
            if (settings.showHintAfterSignIn) { setShowMore(true) }
          }}
        />
      </View>
      <View>
        {showMore ?
          <SignInCardMorePart
            onCollapseButtonClick={() => setShowMore(false)}
            onNeverShowAgainButtonClick={() => {
              setShowMore(false)
              void setNeedShowHintAfterSignIn(false)
            }}
          />
          : <></>
        }
      </View>
    </Card>
  )
}

export default SignInCard
