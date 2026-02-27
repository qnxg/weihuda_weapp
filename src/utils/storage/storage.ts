import Taro from '@tarojs/taro'
import { tokenKey } from './token'

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
export async function setStorageAsync(key: string, data: unknown) {
  return new Promise((res, rej) =>
    Taro.setStorage({
      key: key,
      data: data,
      success: res,
      fail: v => rej(v.errMsg),
    })
  )
}

const storageTimestampKey = 'STORAGE_COMPILE_TIMESTAMP'

export const IMPORTANT_STORAGE_KEY_PREFIX = [
  storageTimestampKey,
  tokenKey,
] as const satisfies string[]
/**
 * 删除不重要的storage内容
 */
export function cleanNotImportantStorage() {
  const importantKeys = Taro.getStorageInfoSync().keys.filter(k =>
    IMPORTANT_STORAGE_KEY_PREFIX.values().some(p => k.startsWith(p))
  )
  const backup = Taro.batchGetStorageSync(importantKeys).map((v, idx) => ({
    key: importantKeys[idx]!,
    value: v,
  }))
  Taro.clearStorageSync()
  Taro.batchSetStorageSync(
    backup as any // see https://github.com/NervJS/taro/issues/18911
  )
}

// 重新编译后自动清理原有storage，确保新版本的代码不会被旧的storage影响
const timestampFromStorage = Taro.getStorageSync(storageTimestampKey)
console.log('当前编译时间：', process.env.COMPILE_TIMESTAMP)
console.log('来自storage的编译时间：', timestampFromStorage)
if (timestampFromStorage !== process.env.COMPILE_TIMESTAMP) {
  console.log('正在清理storage……')
  Taro.setStorageSync(storageTimestampKey, process.env.COMPILE_TIMESTAMP)
  cleanNotImportantStorage()
}
