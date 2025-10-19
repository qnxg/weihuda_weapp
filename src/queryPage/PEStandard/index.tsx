import { Image, View } from '@tarojs/components'
import React, { useState } from 'react'
import styles from './index.module.scss'
import Tabs from '@/components/Tab'
import { staticBaseUrl as baseUrl } from '@/utils/url'

const pages = ['简介', '男生', '女生']
const urls = [
  `${baseUrl}tice/v3_info.svg`,
  `${baseUrl}tice/v3_m.svg`,
  `${baseUrl}tice/v3_w.svg`,
]

const Index: React.FC = () => {
  const [index, setIndex] = useState(0)

  const onChangeTab = (page: number): void => {
    setIndex(page)
  }

  const tabItems = pages.map((page, idx) => ({
    key: idx,
    label: page,
    body: (
      <View className={styles.box}>
        <Image className={styles.pic} src={urls[index]!} mode='widthFix' />
      </View>
    ),
  }))

  return (
    <View>
      <Tabs current={index} onChange={onChangeTab} items={tabItems}></Tabs>
    </View>
  )
}

export default Index
