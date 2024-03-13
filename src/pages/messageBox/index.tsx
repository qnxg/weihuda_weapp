import { Message, getMessage } from '@/apis/back/message'
import DisplayCard from '@/components/DisplayCard'
import icon from '@/static/mine/icon-date.svg'
import { Block, Navigator, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import React, { useEffect, useState } from 'react'
import styles from './index.module.scss'

const Index: React.FC = () => {
  const [data, setData] = useState<Message[] | null>(null)

  /**
   * 获取数据
   */
  const getData = async () => {
    Taro.showLoading({
      mask: true,
      title: '加载中...'
    })
    try {
      const res = await getMessage()
      setData(res)
    } catch (err) {
      Taro.showToast({
        icon: 'none',
        title: err.toString()
      })
    }
    Taro.hideLoading()
  }

  useEffect(() => {
    getData()
  }, [])

  // const { data, loading } = useGraphql<RootObject>(
  //   {
  //     query: `
  //     query message{
  //       message{
  //         id
  //         title
  //         content
  //         url
  //         create_at
  //       }
  //     }
  //     `,
  //     operationName: 'message'
  //   },
  //   {
  //     onError: (error) => {
  //       Taro.showToast({
  //         icon: 'none',
  //         title: error.toString()
  //       })
  //     }
  //   }
  // )

  // useEffect(() => {
  //   if (loading) {
  //     Taro.showLoading({
  //       mask: true,
  //       title: '正在获取数据'
  //     })
  //   } else {
  //     Taro.hideLoading()
  //   }
  // }, [loading])

  return (
    <Block>
      <View>
        {data && data.length !== 0 ? (
          data.map((item) => {
            return (
              <View key={Math.random()}>
                {item.url ? (
                  <Navigator key={Math.random()} url={item.url ? item.url : ''}>
                    <DisplayCard key={String(item.id)} title={item.create_at} icon={icon}>
                      <View className={styles.content_out}>
                        <View className={styles.title}>{item.title}</View>
                        <View className={styles.content}>{item.content}</View>
                      </View>
                    </DisplayCard>
                  </Navigator>
                ) : (
                  <DisplayCard key={String(item.id)} title={item.create_at} icon={icon}>
                    <View className={styles.content_out}>
                      <View className={styles.title}>{item.title}</View>
                      <View className={styles.content}>{item.content}</View>
                    </View>
                  </DisplayCard>
                )}
              </View>
            )
          })
        ) : (
          <DisplayCard title='----/--/--' icon={icon}>
            <View className={styles.content_out}>
              <View className={styles.title}>还没有接收到新消息噢</View>
            </View>
          </DisplayCard>
        )}
      </View>
    </Block>
  )
}

export default Index
