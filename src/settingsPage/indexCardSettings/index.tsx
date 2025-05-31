import { Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { LineDividedButtonList } from '@/components/LineDividedButtonList'
import LineDividedSwitchList from '@/components/LineDividedSwitchList'
import useShouldRelaunchIndex from '@/utils/hooks/useShouldRelaunchIndex'
import { getUserSettings } from '@/utils/storage/userSettings'
import { setNeedShowSignInCard } from '@/utils/storage/userSettings/customAccessors/SignInCardSettings'

const nav = (url: string) => () => Taro.navigateTo({ url: url })

const NavList: React.FC = () => (
  <LineDividedButtonList
    items={[
      {
        title: <Text>常规卡片排序</Text>,
        onClick: nav('./normalCardSettings/index'),
      },
    ]}
  />
)

async function initSignInSettings() {
  return {
    checked: (await getUserSettings(s => s.indexSignInCardSettings)).show,
    disabled: false,
  }
}

const SwitchList: React.FC<{
  setShouldRelaunchIndex: (s: boolean) => unknown
}> = props => {
  return (
    <LineDividedSwitchList
      items={[
        {
          title: '显示签到卡片',
          init: initSignInSettings,
          async onChange(e) {
            props.setShouldRelaunchIndex(true)
            await setNeedShowSignInCard(e.detail.value)
            return {
              checked: (await getUserSettings(s => s.indexSignInCardSettings))
                .show,
              disabled: false,
            }
          },
        },
      ]}
    />
  )
}

/** 小程序首页卡片设置页面 */
const Index: React.FC = () => {
  const [setShouldRelaunchIndex] = useShouldRelaunchIndex(false)
  return (
    <>
      <NavList />
      <SwitchList setShouldRelaunchIndex={setShouldRelaunchIndex} />
    </>
  )
}

export default Index
