import { Text } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { LineDividedButtonList } from "@/components/LineDividedButtonList";
import LineDividedSwitchList from "@/components/LineDividedSwitchList";

const nav = (url: string) => () => Taro.navigateTo({ url: url })

/** 小程序首页卡片设置页面 */
const Index: React.FC = () => {
    return <>
        <LineDividedButtonList
            items={[
                {
                    title: <Text>常规卡片排序</Text>,
                    onClick: nav('./normalCardSettings/index')
                }
            ]}
        />
        {/* <LineDividedSwitchList
            items={[
                {
                    title: "显示签到卡片",
                    init: async () => {
                        console.log("INIT...")
                        await new Promise(res => setTimeout(res, 3000))
                        console.log("END INIT")
                        return {
                            checked: true,
                            disabled: false,
                        }
                    },
                    async onChange(e) {
                        console.log("CHANGE...")
                        await new Promise(res => setTimeout(res, 3000))
                        console.log("END CHANGE")
                        return {
                            checked: e.detail.value,
                            disabled: false
                        }
                    },
                }
            ]}
        /> */}
    </>
}

export default Index;