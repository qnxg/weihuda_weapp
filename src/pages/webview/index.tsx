import { View, WebView } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import React, { useEffect } from 'react'
import { getJifenWebviewReadApi } from '@/apis/jifen'

const Index: React.FC = () => {
  const { params } = useRouter()
  const { url, title, from } = params
  useEffect(() => {
    let cleanUp = () => {}
    if (from === 'zhihu') {
      const w = setTimeout(() => {
        getJifenWebviewReadApi({ url: url! })
          .then(jifen =>
            Taro.showToast({
              title: `今日阅读积分 +${jifen}`,
              icon: 'none',
            })
          )
          .catch(() => {})
      }, 5000)
      cleanUp = () => clearTimeout(w)
    }
    if (title) {
      void Taro.setNavigationBarTitle({ title: title! })
    }
    return cleanUp
  }, [from, title, url])
  return (
    <View>
      <WebView src={url!} />
    </View>
  )
}

export default Index
