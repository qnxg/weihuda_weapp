import { Text } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useEffect, useState } from "react";
import { LineDividedButtonList } from "@/components/LineDividedButtonList";
import LineDividedSwitchList from "@/components/LineDividedSwitchList";
import useShouldRelaunchIndex from "@/utils/hooks/useShouldRelaunchIndex";
import { getUserSettings, modifyUserSettings } from "@/utils/storage/userSettings";
import { DEFAULT_INDEX_SIGNIN_CARD_SETTINGS } from "@/utils/storage/userSettings/defaults/indexSignInCardSettings";

const nav = (url: string) => () => Taro.navigateTo({ url: url })

/** 小程序首页卡片设置页面 */
const Index: React.FC = () => {

    const [setShouldRelaunchIndex] = useShouldRelaunchIndex(false);
    return <>
        <LineDividedButtonList
            items={[
                {
                    title: <Text>常规卡片排序</Text>,
                    onClick: nav('./normalCardSettings/index')
                }
            ]}
        />
        <LineDividedSwitchList
            items={[
                {
                    title: "显示签到卡片",
                    init: async () => {
                        return {
                            checked: (await getUserSettings(
                                s => s.indexSignInCardSettings
                            )).show,
                            disabled: false,
                        }
                    },
                    async onChange(e) {
                        setShouldRelaunchIndex(true);
                        await modifyUserSettings(s => ({
                            ...s,
                            indexSignInCardSettings: {
                                ...s.indexSignInCardSettings,
                                settingsMajorVersion: DEFAULT_INDEX_SIGNIN_CARD_SETTINGS.settingsMajorVersion,
                                show: e.detail.value,

                            },
                        }))
                        return {
                            checked: (await getUserSettings(
                                s => s.indexSignInCardSettings
                            )).show,
                            disabled: false
                        }
                    },
                }
            ]}
        />
    </>
}

export default Index;