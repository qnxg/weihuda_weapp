import { useCallback } from 'react'
import LineDividedSwitchList from '@/components/LineDividedSwitchList'
import usePromise from '@/utils/hooks/usePromise'
import useShouldRelaunchIndex from '@/utils/hooks/useShouldRelaunchIndex'
import { fetchUserSettings } from '@/utils/storage/userSettings'
import {
  setNeedShowHintAfterSignIn,
  setNeedShowSignInCard,
} from '@/utils/storage/userSettings/customAccessors/SignInCardSettings'
import type { SwitchChangeEvent } from '@/components/AsyncSwitch'

const getSignInCardSettings = async () =>
  (await fetchUserSettings()).indexSignInCardSettings

const SwitchList: React.FC<{
  setShouldRelaunchIndex: (s: boolean) => unknown
}> = ({ setShouldRelaunchIndex }) => {


  const [signInCardSettings, loadingSignInCardSettings] = usePromise(
    getSignInCardSettings,
    undefined,
    [getSignInCardSettings]
  )

  const onNeedShowSignInCardChange = useCallback(
    async (e: SwitchChangeEvent) => {
      setShouldRelaunchIndex(true)
      await setNeedShowSignInCard(e.detail.value)
      return {
        checked: (await getSignInCardSettings()).show,
        disabled: false,
      }
    },
    [setShouldRelaunchIndex]
  )

  const onNeedShowHintAfterSignInChange = useCallback(
    async (e: SwitchChangeEvent) => {
      setShouldRelaunchIndex(true)
      await setNeedShowHintAfterSignIn(e.detail.value)
      return {
        checked: (await getSignInCardSettings()).showHintAfterSignIn,
        disabled: false,
      }
    },
    [setShouldRelaunchIndex]
  )

  return (
    <LineDividedSwitchList
      items={[
        {
          title: '显示签到卡片',
          init: {
            checked: signInCardSettings?.show,
            disabled: loadingSignInCardSettings,
          },
          onChange: onNeedShowSignInCardChange,
        },
        {
          title: '签到后显示推荐',
          init: {
            checked: signInCardSettings?.showHintAfterSignIn,
            disabled: loadingSignInCardSettings,
          },
          onChange: onNeedShowHintAfterSignInChange,
        },
      ]}
    />
  )
}

/** 签到卡片设置页面 */
const Index: React.FC = () => {
  const [setShouldRelaunchIndex] = useShouldRelaunchIndex(false)
  return <SwitchList setShouldRelaunchIndex={setShouldRelaunchIndex} />
}

export default Index
