import DisplayCard from '@/components/DisplayCard'
import { Text, View } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import React, { useEffect } from 'react'

const Eye: React.FC = () => {
  const router = useRouter()
  const params = router.params

  useEffect(() => {
    void Taro.setNavigationBarTitle({
      title: '体质测试 视力查询'
    })
  })

  return (
    <View>
      <DisplayCard>
        <View>
          <Text>左裸眼视力：</Text>
          <Text>{params.eyesight_left}</Text>
        </View>
        <View>
          <Text>右裸眼视力：</Text>
          <Text>{params.eyesight_right}</Text>
        </View>
      </DisplayCard>
      <DisplayCard>
        <View>
          <Text>左眼串镜：</Text>
          <Text>{params.eye_mirror_left}</Text>
        </View>
        <View>
          <Text>右眼串镜：</Text>
          <Text>{params.eye_mirror_right}</Text>
        </View>
      </DisplayCard>
      <DisplayCard>
        <View>
          <Text>左眼屈光不正：</Text>
          <Text>{params.eye_ametropia_left}</Text>
        </View>
        <View>
          <Text>右眼屈光不正：</Text>
          <Text>{params.eye_ametropia_right}</Text>
        </View>
      </DisplayCard>
    </View>
  )
}

export default Eye
