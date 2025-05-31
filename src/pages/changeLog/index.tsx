import { View, WebView } from '@tarojs/components'
import React from 'react'

const Index: React.FC = () => {
  return (
    <View>
      <WebView src='https://new.qnxg.cn/mp-static/web/dist/changelog/' />
    </View>
  )
}

export default Index
