import { Text, View } from '@tarojs/components'
import { useRouter } from '@tarojs/taro'
import React from 'react'

import DisplayCard from '@/components/DisplayCard'

const Detail: React.FC = () => {
  const router = useRouter()
  const { tranAmt, effectDate, jourDate, tranname, tranLocation, jourName, jourNum } = router.params

  return (
    <View>
      <DisplayCard>
        <View>
          <Text>交易金额：</Text>
          <Text>{tranAmt}</Text>
        </View>
        <View>
          <Text>交易对象：</Text>
          <Text>{tranLocation}</Text>
        </View>
        <View>
          <Text>交易状态：</Text>
          <Text>{jourName}</Text>
        </View>
        <View>
          <Text>交易类型：</Text>
          <Text>{tranname}</Text>
        </View>
        <View>
          <Text>交易时间：</Text>
          <Text>{effectDate}</Text>
        </View>
        <View>
          <Text>记账时间：</Text>
          <Text>{jourDate}</Text>
        </View>
        <View>
          <Text>订单号：</Text>
          <Text>{jourNum}</Text>
        </View>
      </DisplayCard>
    </View>
  )
}

export default Detail
