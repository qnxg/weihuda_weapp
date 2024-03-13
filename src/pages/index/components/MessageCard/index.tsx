import { Message } from '@/apis/back/message'
import icon from '@/static/index/icon/message.svg'
import { Block, Swiper, SwiperItem, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import React, { useEffect, useMemo, useState } from 'react'
import CardLayout from '../CardLayout'
import styles from './index.module.scss'

interface IProps {
  message: Message[]
}

const MessageCard: React.FC<IProps> = ({ message }) => {
  const isOverOne = message?.length > 1
  const isNew = message?.length > 0

  const [current, setCurrent] = useState(0)
  const [dyHeight, setDyHeight] = useState<string>('120rpx')

  const dyHeightList = useMemo(() => {
    if (isNew) {
      return message.map((item) => {
        const content = item.content
        const numberAndLetter = content.match(/[\u0000-\u00ff]/g)?.length || 0
        const lineLength = content.length - numberAndLetter - 1
        return `${120 + 40 * Math.floor(lineLength / 20)}rpx`
      })
    }
    return ['120rpx']
  }, [isNew, message])

  useEffect(() => {
    if (dyHeight !== dyHeightList[current]) {
      setDyHeight(dyHeightList[current])
    }
  }, [dyHeightList, current, dyHeight])

  return (
    <Block>
      {isNew && (
        <CardLayout icon={icon} title='消息盒子'>
          <Swiper
            circular
            duration={500}
            interval={3000}
            current={current}
            autoplay={isOverOne}
            className={styles.sOuter}
            easingFunction='easeInOutCubic'
            onChange={(e) => setCurrent(e.detail.current)}
            style={{ height: dyHeight }}
          >
            {message.map((item) => {
              return (
                <SwiperItem
                  className={styles.sItem}
                  key={item.title}
                  onClick={() => {
                    Taro.navigateTo({ url: item.url ? item.url : '/pages/messageBox/index' })
                  }}
                >
                  <View className={styles.cOuter}>
                    <View className={styles.title}>{item.title}</View>
                    <View className={styles.content}>{item.content}</View>
                  </View>
                </SwiperItem>
              )
            })}
          </Swiper>
        </CardLayout>
      )}
    </Block>
  )
}

export default MessageCard
