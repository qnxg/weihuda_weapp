import { Image, View } from '@tarojs/components'
import dayjs from 'dayjs'
import React, { useEffect, useState } from 'react'
import styles from './index.module.scss'
import { getSmesterInfo } from '@/apis/info'
import Tabs from '@/components/Tab'
import Panel from '@/components/Tab/components/Panel'
import { useAppSelector } from '@/utils/hooks/redux'
import { staticBaseUrl as baseUrl } from '@/utils/url'
import type { SmesterInfo } from '@/apis/info'

const pages = ['秋季', '寒假', '春季', '夏季']
const urls = [
  `${baseUrl}xiaoli/pic0.svg`,
  `${baseUrl}xiaoli/pic1.svg`,
  `${baseUrl}xiaoli/pic2.svg`,
  `${baseUrl}xiaoli/pic3.svg`,
]

const Index: React.FC = () => {
  const { termType } = useAppSelector(state => state.smester)

  const [data, setData] = useState<SmesterInfo | null>(null)
  const [index, setIndex] = useState(termType && termType > 1 ? termType : 0)

  /**
   * 获取数据
   */
  const getData = async () => {
    const res = await getSmesterInfo()
    setData(res)
  }

  useEffect(() => {
    void getData()
  }, [])

  useEffect(() => {
    if (termType === 1 && data) {
      const today = dayjs()
      const vacationDay = dayjs(data.vacation)
      const nextDay = dayjs(data.next)
      if (
        (today.isSame(vacationDay, 'day') ||
          today.isAfter(vacationDay, 'day')) &&
        (today.isSame(nextDay, 'day') || today.isBefore(nextDay, 'day'))
      ) {
        setIndex(1)
      }
    }
  }, [data, termType])

  const onChangeTab = (page: number): void => {
    setIndex(page)
  }

  return (
    <View>
      <Tabs items={pages} current={index} onChange={onChangeTab}>
        <Panel current={index} index={0}>
          <View className={styles.box}>
            <Image className={styles.pic} src={urls[index]} mode='widthFix' />
          </View>
        </Panel>

        <Panel current={index} index={1}>
          <View className={styles.box}>
            <Image className={styles.pic} src={urls[index]} mode='widthFix' />
          </View>
        </Panel>

        <Panel current={index} index={2}>
          <View className={styles.box}>
            <Image className={styles.pic} src={urls[index]} mode='widthFix' />
          </View>
        </Panel>

        <Panel current={index} index={3}>
          <View className={styles.box}>
            <Image className={styles.pic} src={urls[index]} mode='widthFix' />
          </View>
        </Panel>
      </Tabs>
    </View>
  )
}

export default Index
