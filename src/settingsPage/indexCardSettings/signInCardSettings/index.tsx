import { useCallback } from 'react'
import LineDividedSwitchList from '@/components/LineDividedSwitchList'
import usePromise from '@/utils/hooks/usePromise'
import useShouldRelaunchIndex from '@/utils/hooks/useShouldRelaunchIndex'
import { getUserSettings } from '@/utils/storage/userSettings'
import { setNeedShowSignInCard } from '@/utils/storage/userSettings/customAccessors/SignInCardSettings'
import type { SwitchChangeEvent } from '@/components/AsyncSwitch'

const getSignInCardSettings = async () =>
  await getUserSettings(s => s.indexSignInCardSettings)

const SwitchList: React.FC<{
  setShouldRelaunchIndex: (s: boolean) => unknown
}> = ({ setShouldRelaunchIndex }) => {
  const [signInCardSettings, loadingSignInCardSettings] = usePromise(
    getSignInCardSettings,
    undefined,
    []
  )

  const onNeedShowSignInCardChange = useCallback(
    async (e: SwitchChangeEvent) => {
      setShouldRelaunchIndex(true)
      await setNeedShowSignInCard(e.detail.value)
      return {
        checked: (await getUserSettings(s => s.indexSignInCardSettings)).show,
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
