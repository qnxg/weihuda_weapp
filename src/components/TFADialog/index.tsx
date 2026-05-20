import Taro from '@tarojs/taro'

const TFA_PAGE = '/pages/tfa/index'

let navigating = false

/**
 * 打开双因子认证页（无参、非阻塞）。
 * 由 request 拦截器在需要 2FA 时调用，任意页面均可跳转。
 */
export function showTFADialog(): void {
  const pages = Taro.getCurrentPages()
  const top = pages[pages.length - 1]
  if (top?.route === 'pages/tfa/index') {
    return
  }
  if (navigating) {
    return
  }
  navigating = true
  void Taro.navigateTo({ url: TFA_PAGE })
    .catch(() => Taro.redirectTo({ url: TFA_PAGE }))
    .finally(() => {
      navigating = false
    })
}
