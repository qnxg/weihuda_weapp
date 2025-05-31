import type { SettingsItem } from ".";

/** 首页签到卡片设置的结构 */
export interface IndexSignInCardSettings extends SettingsItem {
    show: boolean,
    showHintAfterSignIn: boolean
}

/** 首页签到卡片默认设置 */
export const DEFAULT_INDEX_SIGNIN_CARD_SETTINGS: IndexSignInCardSettings = {
    settingsMajorVersion: "0",
    show: true,
    showHintAfterSignIn: true,
}