import { useCallback } from 'react'
import LineDividedSwitchList from '@/components/LineDividedSwitchList'
import useShouldRelaunchIndex from '@/utils/hooks/useShouldRelaunchIndex'
import { getUserSettings } from '@/utils/storage/userSettings'
import { setNeedShowSignInCard } from '@/utils/storage/userSettings/customAccessors/SignInCardSettings'
import type { SwitchChangeEvent } from '@/components/AsyncSwitch'

async function initSignInSettings() {
  return {
    checked: (await getUserSettings(s => s.indexSignInCardSettings)).show,
    disabled: false,
  }
}

const SwitchList: React.FC<{
  setShouldRelaunchIndex: (s: boolean) => unknown
}> = ({ setShouldRelaunchIndex }) => {

  const onNeedShowSignInCardChange = useCallback(async (e: SwitchChangeEvent) => {
    setShouldRelaunchIndex(true)
    await setNeedShowSignInCard(e.detail.value)
    return {
      checked: (await getUserSettings(s => s.indexSignInCardSettings))
        .show,
      disabled: false,
    }
  }, [setShouldRelaunchIndex]);


  return (
    <LineDividedSwitchList
      items={[
        {
          title: '显示签到卡片',
          init: initSignInSettings,
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
