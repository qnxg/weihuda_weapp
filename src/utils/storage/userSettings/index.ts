import Taro from "@tarojs/taro";
import { DEFAULT_SETTINGS, UserSettings } from "./defaults";
import { SettingsItem } from "./defaults/index.type";

const USER_SETTINGS_KEY = 'User-Settings'
/** 获取部分设置
 *
 * 当配置不存在或者settingsMajorVersion冲突时将使用默认配置
 * @example
 * const someSettings = getUserSettingSync(s => s.someSettings)
 */

export function getUserSettingsSync<T extends SettingsItem>(
    selector: (userSettings: UserSettings) => T | undefined
): T
/** 获取所有设置
 *
 * 多数情况下你可能需要使用“获取部分设置”的重载，
 * 因为这个重载只会在所有设置都不存在时才返回默认设置。
 * 其余情况不会自动填充缺失的配置项。
 * 这个重载也不会处理settingsMajorVersion的逻辑
 */
export function getUserSettingsSync(): UserSettings
export function getUserSettingsSync<T extends SettingsItem>(
    selector?: (userSettings: UserSettings) => T | undefined
) {
    if (selector == undefined) {
        const settingsRaw = Taro.getStorageSync(USER_SETTINGS_KEY)
        if (settingsRaw == undefined || settingsRaw === "") {
            return DEFAULT_SETTINGS
        }
        return settingsRaw
    } else {
        const selectStorageResult = selector(getUserSettingsSync())
        const selectDefaultResult = selector(DEFAULT_SETTINGS)
        if (selectDefaultResult == undefined) {
            throw new Error(
                `不正确的默认配置或不正确的selector实现。 ` +
                `selector: ${selector.toString()} ` +
                `DEFAULT_SETTINGS: ${JSON.stringify(DEFAULT_SETTINGS)}`
            )
        }
        if (selectStorageResult == undefined ||
            selectStorageResult.settingsMajorVersion != selectDefaultResult.settingsMajorVersion) {
            return selectDefaultResult
        } else {
            return selectStorageResult
        }
    }
}

/** 调用该函数前请确认是否将待设置的版本与默认配置版本同步 */
export const setAllUserSettingsSync =
    (newUserSettings: UserSettings) =>
        Taro.setStorageSync(USER_SETTINGS_KEY, newUserSettings)

/** 调用该函数时请确认是否将待设置的版本与默认配置版本同步 */
export const modifyUserSettingsSync =
    (modifier: (oldUserSettings: UserSettings) => UserSettings) =>
        setAllUserSettingsSync(modifier(getUserSettingsSync()))
