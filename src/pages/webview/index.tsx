import { getJifenWebviewReadApi } from '@/apis/jifen'
import { View, WebView } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import React, { useEffect } from 'react'

const Index: React.FC = () => {
  const { params } = useRouter()
  const { url, title, from } = params
  useEffect(() => {
    if (from === 'zhihu') {
      setTimeout(() => {
        getJifenWebviewReadApi({ url: url! })
      }, 5000)
    }
    if (title) {
      Taro.setNavigationBarTitle({ title: title! })
    }
  }, [])
  return (
    <View>
      <WebView src={url!} />
    </View>
  )
}

export default Index
