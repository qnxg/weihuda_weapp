import { Text } from "@tarojs/components"
import Taro from "@tarojs/taro"
import { LineDividedButtonList } from "@/components/LineDividedButtonList"

const nav = (url: string) => () => Taro.navigateTo({ url: url })

/** 小程序设置页面的主页，从这里导航到各个小程序设置项目 */
const Index: React.FC = () => {
    return <LineDividedButtonList
        items={[
            {
                title: <Text>首页卡片设置</Text>,
                onClick: nav('./indexCardSettings/index')
            }
        ]}
    />
}

export default Index