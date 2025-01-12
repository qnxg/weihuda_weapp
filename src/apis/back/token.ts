import getLoginCode from '@/utils/getLoginCode'
import request from '@/utils/request'
import storage from '@/utils/storage'

// 避免多次请求
let getTokenPromise: Promise<any> | null = null

/**
 * 用code换取token，并自动持久化到localStorage
 */
export const getTokenApi = async () => {
  if (getTokenPromise) {
    return getTokenPromise
  }
  getTokenPromise = new Promise(async (resolve, reject) => {
    const code = await getLoginCode();
    const token = await request.get<string>('/token', {
      data: {
        code
      }
    }).catch(() => null)
    getTokenPromise = null
    if (!token) {
      reject(null)
      return
    }
    storage.setToken(token)
    resolve(token)
  })
  return getTokenPromise
}
