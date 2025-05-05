import { IndexCardSettings } from "./indexCardSettings";

export interface SettingsItem {
    /** 用于设置的后向兼容，
     * 当用户配置中的这项和默认配置的这项不同时，
     * 应该忽略用户配置，使用默认配置 */
    settingsMajorVersion: string
}

export interface Settings { [key: string]: SettingsItem | undefined} 
/** 当前小程序的所有用户配置项目列于此处
 *
 * 由于微信小程序以及后端实现限制，配置必须可以正确的被JSON.stringyfy
 */

export interface UserSettings extends Settings {
    indexCardSettings: IndexCardSettings
}
