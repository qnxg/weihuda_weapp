import { DEFAULT_INDEX_CARD_SETTINGS } from "./indexCardSettings";

/** 当前小程序的所有用户配置项目列于此处
 *
 * 由于微信小程序以及后端实现限制，配置必须可以正确的被JSON.stringyfy
 */
export type UserSettings = typeof DEFAULT_SETTINGS
/** 小程序设置项满足的接口 */
export interface SettingsItem {
    /** 用于设置的后向兼容，
     * 当用户配置中的这项和默认配置的这项不同时，
     * 应该忽略用户配置，使用默认配置 */
    settingsMajorVersion: string;
}
/** 整个小程序设置对象满足的接口 */

export interface Settings { [key: string]: SettingsItem | undefined; }


/** 总的小程序默认设置 */
export const DEFAULT_SETTINGS = {
    /** 首页卡片设置 */
    indexCardSettings: DEFAULT_INDEX_CARD_SETTINGS
} satisfies Settings