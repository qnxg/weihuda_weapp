import { View, WebView } from '@tarojs/components'
import React from 'react'
import { newStaticBaseUrl } from '@/utils/url'

const Index: React.FC = () => {
  return (
    <View>
      <WebView src={`${newStaticBaseUrl}/update`} />
    </View>
  )
}

export default Index
