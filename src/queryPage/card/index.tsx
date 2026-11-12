import { Image, Navigator, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import dayjs from 'dayjs'
import React, { Fragment, useCallback, useEffect, useState } from 'react'
import PickerArea from './components/PickerArea'
import styles from './index.module.scss'
import { getCardHistory } from '@/apis/pt/card'
import DisplayCard from '@/components/DisplayCard'
import PullRefresh from '@/components/PullRefresh'
import TabBar from '@/components/TabBar'
import empty from '@/static/empty/no-grade.svg'
import { months } from '@/utils/config'
import type { CardHistoryData } from '@/apis/pt/card'

const Index: React.FC = () => {
  const [show, setShow] = useState(false)
  const [index, setIndex] = useState(0)
  const type = ['消费', '充值']

  const year: Array<string> = []
  for (let i = 0; i <= dayjs().diff(dayjs('2020-01-01'), 'years'); ++i) {
    year.unshift(String(dayjs('2020-01-01').add(i, 'year').year()))
  }
  const temp = Array(2).fill(0)
  temp[0] = year.findIndex(item => {
    return item == String(dayjs().year())
  })
  temp[1] = months.findIndex(item => {
    return item == String(dayjs().month() + 1)
  }) //返回的月份范围是0~11
  const [picker, setPicker] = useState(temp)

  const onChangeFirstTab = (i: number): void => {
    setIndex(i)
  }

  const [data, setData] = useState<CardHistoryData | null>(null)

  const yearPicker0 = year[picker[0]]
  /**
   * 获取数据
   */
  const getData = useCallback(async () => {
    await Taro.showLoading({
      mask: true,
      title: '加载中...',
    })
    try {
      const res = await getCardHistory({
        year: yearPicker0!,
        month: months[picker[1]]!,
        type: String(index + 1),
      })
      if (!res) {
        setShow(false)
      } else {
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
  }, [index, picker, yearPicker0])

  useEffect(() => {
    void getData()
  }, [getData, index, picker])

  const onRefresh = async (close: () => void) => {
    await getData()
    close()
  }

  return (
    <Fragment>
      <TabBar items={type} num={0} onClick={onChangeFirstTab} current={index} />
      <PullRefresh runFunc={onRefresh} topGap={68}>
        <PickerArea year={year} picker={picker} setPicker={setPicker} />
        {data && show && data.items.length > 0 ? (
          <View style={{ padding: 0 }}>
            <View className={styles.totalAmount}>
              {index == 0
                ? // 消费和充值的获取走的是同一个后端接口，因此消费的原始数据是负数
                  // 具体数据处理见爬虫 src/handlers/pt.rs get_card_history_handler()
                  `共有${data.TranCount}次消费，消费了${(-data.total).toFixed(2)}元`
                : `共有${data.TranCount}次充值，充值了${data.total.toFixed(2)}元`}
            </View>
            {data.items.map(item => {
              return (
                <View key={1}>
                  {index == 0 ? (
                    <Navigator
                      url={`/queryPage/card/detail?tranAmt=${item.tranAmt}&effectDate=${item.effectDate}&jourDate=${item.jourDate}&tranname=${item.tranname}&tranLocation=${item.tranLocation}&jourName=${item.jourName}&jourNum=${item.jourNum}`}
                    >
                      <DisplayCard
                        title={item.effectDate}
                        subTitle={String(item.tranAmt)}
                        key={Math.random()}
                      >
                        <View>
                          {item.tranname === '领取补助'
                            ? '领取补助（余额同步）'
                            : `消费地点：${item.tranLocation}`}
                        </View>
                        <View>消费后余额：{item.nowAmt}</View>
                      </DisplayCard>
                    </Navigator>
                  ) : (
                    <Navigator
                      url={`/queryPage/card/detail?tranAmt=${item.tranAmt}&effectDate=${item.effectDate}&jourDate=${item.jourDate}&tranname=${item.tranname}&tranLocation=${item.tranLocation}&jourName=${item.jourName}&jourNum=${item.jourNum}`}
                    >
                      <DisplayCard
                        title={item.effectDate}
                        subTitle={String(item.tranAmt)}
                        key={Math.random()}
                      >
                        <View>
                          {item.tranname === '领取补助'
                            ? '领取补助（余额同步）'
                            : `充值方式：${item.tranname}`}
                        </View>
                        <View>充值后余额：{item.nowAmt}</View>
                      </DisplayCard>
                    </Navigator>
                  )}
                </View>
              )
            })}
          </View>
        ) : (
          <View className={styles.empty}>
            <Image src={empty} className={styles.img} />
            <View className={styles.text}>
              {dayjs()
                .year(Number(year[picker[0]]))
                .month(Number(months[picker[1]]))
                .isBefore('2020-10-01', 'month')
                ? '暂仅支持查询2020年9月及以后的账单'
                : '没有找到相关记录'}
            </View>
          </View>
        )}
      </PullRefresh>
    </Fragment>
  )
}

export default Index
