import Taro from '@tarojs/taro'

// 见项目根目录的.env文件
export const useTestingCode = process.env.TARO_APP_USE_TESTING_CODE === 'true'

export const testingCode = 'testing'

export default async (): Promise<string> => {
  if (useTestingCode) {
    return testingCode
  } else {
    return (await Taro.login()).code
  }
}
