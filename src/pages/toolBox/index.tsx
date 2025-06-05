import { Image, Navigator, Text, View } from '@tarojs/components'
import React from 'react'
import { data } from './config'

import styles from './index.module.scss'

const Index: React.FC = () => {
  return (
    <View enable-flex className={styles.container}>
      {data.map(cate => {
        return (
          <View key={cate.name} className={styles.category}>
            <View className={styles.title}>{cate.name}</View>
            <View className={styles.content}>
              {cate.member.map(item => {
                return (
                  <Navigator
                    url={item.navigator}
                    className={styles.item}
                    key={item.title}
                    hoverClass={styles.itemHover}
                    hoverStayTime={400}
                  >
                    <Image src={item.imgUrl} className={styles.itemImg} />
                    <View className={styles.itemTitle}>
                      <Text>{item.title}</Text>
                    </View>
                  </Navigator>
                )
              })}
            </View>
          </View>
        )
      })}
    </View>
  )
}

export default Index
