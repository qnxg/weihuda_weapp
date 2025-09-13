import { Image, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import dayjs from 'dayjs'
import React, { Fragment, useEffect, useState } from 'react'
import styles from './index.module.scss'
import { getLabArrange } from '@/apis/pt/labArrange'
import DisplayCard from '@/components/DisplayCard'
import PullRefresh from '@/components/PullRefresh'
import TabBar from '@/components/TabBar'
import empty from '@/static/empty/no-grade.svg'

const Index: React.FC = () => {
  const [show, setShow] = useState(false)
  const [index, setIndex] = useState(0)
  const type = ['未做', '已做']

  const onChangeFirstTab = (i: number): void => {
    setIndex(i)
  }

  const [data, setData] = useState<any[] | null>(null)

  /**
   * 获取数据
   */
  const getData = async () => {
    await Taro.showLoading({
      mask: true,
      title: '加载中...',
    })
    try {
      const res = await getLabArrange()
      if (!res) {
        setShow(false)
      } else {
        const nowDate = dayjs()
        res.forEach(value => {
          if (nowDate.isAfter(dayjs(value.date), 'day')) {
            value.finished = 1
          } else {
            value.finished = 0
          }
        })
        setData(res)
        setShow(true)
      }
    } catch (err) {
      setShow(false)
      await Taro.showToast({
        icon: 'none',
        title: err.toString(),
      })
    } finally {
      Taro.hideLoading()
    }
  }

  useEffect(() => {
    void getData()
  }, [index])

  const onRefresh = async (close: () => void) => {
    await getData()
    close()
  }

  return (
    <Fragment>
      <TabBar items={type} num={0} onClick={onChangeFirstTab} current={index} />
      <PullRefresh runFunc={onRefresh} topGap={68}>
        {data && show && data.length > 0 ? (
          <View style={{ padding: 0 }}>
            {data.map(item => {
              const temp = item.date.split('/')
              const rest = dayjs(
                new Date(+temp[0], +temp[1] - 1, +temp[2])
              ).diff(dayjs(), 'day')
              if (item.finished === index) {
                return (
                  <DisplayCard
                    title={item.name}
                    key={Math.random()}
                    subTitle={rest >= 0 ? `${rest}天` : ''}
                  >
                    <View>实验地点：{item.place}</View>
                    <View>
                      实验时间：
                      {`${item.date}  ${item.time}`}
                    </View>
                    <view>
                      课程：{item.classname} {item.classtype}
                    </view>
                  </DisplayCard>
                )
              }
            })}
            <DisplayCard>
              <View style='text-align: center;'>见底了</View>
            </DisplayCard>
          </View>
        ) : (
          <View className={styles.empty}>
            <Image src={empty} className={styles.img} />
            <View className={styles.text}>暂时没有实验</View>
          </View>
        )}
      </PullRefresh>
    </Fragment>
  )
}

export default Index
