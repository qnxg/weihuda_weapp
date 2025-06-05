import Taro from '@tarojs/taro'

export const useTestingCode = false
export const testingCode = 'testing'

export default async (): Promise<string> => {
  if (useTestingCode) {
    return testingCode
  } else {
    return (await Taro.login()).code
  }
}
