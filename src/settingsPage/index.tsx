import { LineDividedButtonList } from "@/components/LineDividedButtonList"
import { Text } from "@tarojs/components"
import Taro from "@tarojs/taro"

const nav = (url: string) => () => Taro.navigateTo({ url: url })

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