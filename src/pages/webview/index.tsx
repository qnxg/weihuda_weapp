import { View, WebView } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import React, { useEffect } from 'react'

const Index: React.FC = () => {
  const { params } = useRouter()
  const { url, title } = params
  useEffect(() => {
    Taro.setNavigationBarTitle({ title: title! })
  })
  return (
    <View>
      <WebView src={url!} />
    </View>
  )
}

export default Index
