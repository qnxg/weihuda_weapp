import { Image, View } from '@tarojs/components'
import React, { useState } from 'react'
import styles from './index.module.scss'
import Tabs from '@/components/Tab'
import Panel from '@/components/Tab/components/Panel'
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

  return (
    <View>
      <Tabs items={pages} current={index} onChange={onChangeTab}>
        <Panel current={index} index={0}>
          <View className={styles.box}>
            <Image className={styles.pic} src={urls[index]!} mode='widthFix' />
          </View>
        </Panel>

        <Panel current={index} index={1}>
          <View className={styles.box}>
            <Image className={styles.pic} src={urls[index]!} mode='widthFix' />
          </View>
        </Panel>

        <Panel current={index} index={2}>
          <View className={styles.box}>
            <Image className={styles.pic} src={urls[index]!} mode='widthFix' />
          </View>
        </Panel>
      </Tabs>
    </View>
  )
}

export default Index
