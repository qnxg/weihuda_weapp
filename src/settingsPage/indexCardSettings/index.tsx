import { Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { LineDividedButtonList } from '@/components/LineDividedButtonList'

const nav = (url: string) => () => Taro.navigateTo({ url: url })

const NavList: React.FC = () => (
  <LineDividedButtonList
    items={[
      {
        title: <Text>常规卡片排序</Text>,
        onClick: nav('./normalCardSettings/index'),
      },
      {
        title: <Text>签到卡片设置</Text>,
        onClick: nav('./signInCardSettings/index'),
      },
    ]}
  />
)

/** 小程序首页卡片设置页面 */
const Index: React.FC = () => {
  return <NavList />
}

export default Index
