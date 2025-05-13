import Taro from "@tarojs/taro";
import { DEFAULT_SETTINGS } from "./defaults";
import { getAllUserSettingsApi, setAllUserSettingsApi } from "@/apis/userSettings";
import type { UserSettings } from "./defaults";
import type { SettingsItem } from "./defaults/index.interface";

/** 异步获取某个storage项目
 * 
 * 遇到错误（例如找不到项目）时log错误并返回undefined。
 * 这个函数不会抛出错误。
 */
export async function getStorageAsyncNoExcept(key: string): Promise<unknown> {
    const logErr = (e: string) => console.log(
        `Cannot find data of ${key} in storage: ${e}\n` +
        `Returning undefined.`
    )
    return new Promise((res, _rej) =>
        Taro.getStorage({
            key: key,
            success: v => res(v.data),
            fail: v => {
                logErr(v.errMsg)
                res(undefined)
            }
        }).catch(e => {
            logErr(e)
            res(undefined)
        })
    )
}

/** 异步设置一个storage项目 */
export async function setStorageAsync(key: string, data: any) {
    return new Promise((res, rej) =>
        Taro.setStorage({
            key: key,
            data: data,
            success: res,
            fail: v => rej(v.errMsg)
        })
    )
}

const USER_SETTINGS_KEY = 'User-Settings'
/** 获取部分设置
 *
 * 当配置不存在或者settingsMajorVersion冲突时将使用默认配置
 * @example
 * const someSettings = getUserSettingSync(s => s.someSettings)
 */
export async function getUserSettings<T extends SettingsItem>(
    selector: (userSettings: UserSettings) => T | undefined
): Promise<T>
/** 获取所有设置
 *
 * 多数情况下你可能需要使用“获取部分设置”的重载，
 * 因为这个重载只会在所有设置都不存在时才返回默认设置。
 * 其余情况不会自动填充缺失的配置项。
 * 这个重载也不会处理settingsMajorVersion的逻辑
 */
export async function getUserSettings(): Promise<UserSettings>
export async function getUserSettings<T extends SettingsItem>(
    selector?: (userSettings: UserSettings) => T | undefined
) {
    if (selector == undefined) {
        const settingsFromStorage = await getStorageAsyncNoExcept(USER_SETTINGS_KEY)
        if (settingsFromStorage == undefined || settingsFromStorage === "") {
            const settingsFromDb = await getAllUserSettingsApi() ?? {}
            await setStorageAsync(USER_SETTINGS_KEY, settingsFromDb)
            return settingsFromDb
        }
        return settingsFromStorage
    } else {
        const selectStorageResult = selector(await getUserSettings())
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

/** 
 * 使用一个对象覆盖设置整个用户小程序设置
 * 
 * 调用该函数前请确认是否将待设置的版本与默认配置版本同步 
*/
export const setAllUserSettings = async (
    newUserSettings: UserSettings
) => {
    await setStorageAsync(USER_SETTINGS_KEY, newUserSettings)
    await setAllUserSettingsApi(newUserSettings)
}

/** 
 * 更改小程序设置。使用回调形式，可以在修改对象后返回而不必重建整个对象。
 * 
 * 调用该函数时请确认是否将待设置的版本与默认配置版本同步
 */
export const modifyUserSettings =
    async (modifier: (oldUserSettings: UserSettings) => UserSettings) =>
        setAllUserSettings(modifier(await getUserSettings()))
