import Taro from '@tarojs/taro'
import { DEFAULT_SETTINGS } from './defaults'
import {
  getAllUserSettingsApi,
  setAllUserSettingsApi,
} from '@/apis/userSettings'
import type { UserSettings } from './defaults'

/** 异步获取某个storage项目
 *
 * 遇到错误（例如找不到项目）时log错误并返回undefined。
 * 这个函数不会抛出错误。
 */
export async function getStorageAsyncNoExcept(key: string): Promise<unknown> {
  const logErr = (e: string) =>
    console.log(
      `Cannot find data of ${key} in storage: ${e}\n` + `Returning undefined.`
    )
  return new Promise((res, _rej) =>
    Taro.getStorage({
      key: key,
      success: v => res(v.data),
      fail: v => {
        logErr(v.errMsg)
        res(undefined)
      },
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
      fail: v => rej(v.errMsg),
    })
  )
}

const USER_SETTINGS_KEY = 'User-Settings'

async function initAndFetchRawUserSettings() {
  const settingsFromStorage = await getStorageAsyncNoExcept(USER_SETTINGS_KEY)
  if (settingsFromStorage == undefined || settingsFromStorage === '') {
    const settingsFromDb = (await getAllUserSettingsApi()) ?? {}
    await setStorageAsync(USER_SETTINGS_KEY, settingsFromDb)
    return settingsFromDb
  }
  return settingsFromStorage
}

export async function fetchUserSettings(): Promise<UserSettings> {
  const res = await initAndFetchRawUserSettings()
  if (typeof res !== 'object') {
    console.log(`无效的用户设置：${JSON.stringify(res)}，将使用默认设置。`)
    return DEFAULT_SETTINGS
  }
  for (const [defaultK, defaultV] of Object.entries(DEFAULT_SETTINGS)) {
    if (!(defaultK in res)) {
      console.log(`用户设置不存在 ${defaultK} 项。将使用默认设置。`)
      res[defaultK] = defaultV
      continue
    }
    if (
      !('settingsMajorVersion' in res[defaultK]) ||
      res[defaultK].settingsMajorVersion !== defaultV.settingsMajorVersion
    ) {
      console.log(`用户设置 ${defaultK} 版本异常或不匹配。将使用默认设置。`)
      res[defaultK] = defaultV
      continue
    }
    for (const [defaultVK, defaultVV] of Object.entries(defaultV)) {
      if (!(defaultVK in res[defaultK])) {
        console.log(
          `用户设置 ${defaultK} 项不存在 ${defaultVK} 子项。将使用默认设置。`
        )
        res[defaultK][defaultVK] = defaultVV
      }
    }
  }
  return res as UserSettings
}

/**
 * 使用一个对象覆盖设置整个用户小程序设置
 *
 * 调用该函数前请确认是否将待设置的版本与默认配置版本同步
 *
 * @deprecated 大部分情况下你可能想要使用`modifyUserSettingsPart`
 */
const setAllUserSettings = async (newUserSettings: UserSettings) => {
  await setStorageAsync(USER_SETTINGS_KEY, newUserSettings)
  await setAllUserSettingsApi(newUserSettings)
}

/**
 * 更改小程序设置。
 *
 * 重要：调用该函数时请确认是否将待设置的版本与默认配置版本同步
 *
 * @deprecated 大部分情况下你可能想要使用`modifyUserSettingsPart`
 */
const modifyUserSettings = async <T extends UserSettings>(
  modifier: (
    oldUserSettings: UserSettings
  ) => Promise<T & Record<Exclude<keyof T, keyof UserSettings>, never>>
) => setAllUserSettings(await modifier(await fetchUserSettings()))

/**
 * 更改某一小程序设置项目。
 *
 * 注意：调用这个函数会强制同步设置版本到默认设置
 */
export const modifyUserSettingsPart = async <K extends keyof UserSettings>(
  key: K,
  modifier: (
    oldUserSettingsPart: UserSettings[K]
  ) => Promise<Omit<UserSettings[K], 'settingsMajorVersion'>>
) => {
  await modifyUserSettings(async old => {
    const newPart: Omit<UserSettings[K], 'settingsMajorVersion'> &
      Partial<Pick<UserSettings[K], 'settingsMajorVersion'>> = await modifier(
      old[key]
    )
    newPart.settingsMajorVersion = DEFAULT_SETTINGS[key].settingsMajorVersion
    return {
      ...old,
      [key]: newPart,
    }
  })
}
