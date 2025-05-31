import { Image, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import dayjs from 'dayjs'
import React, { useEffect, useState } from 'react'
import styles from './index.module.scss'
import { getLibraryApi } from '@/apis/library'
import DisplayCard from '@/components/DisplayCard'
import Card from '@/components/LeftRightCard'
import Left from '@/components/LeftRightCard/components/LeftPart'
import Right from '@/components/LeftRightCard/components/RightPart'
import PullRefresh from '@/components/PullRefresh'
import Tab from '@/components/Tab'
import Panel from '@/components/Tab/components/Panel'
import book from '@/static/empty/book.svg'
import { onColors } from '@/utils/config'
import type { LibraryRes } from '@/apis/library';

const items = ['在借图书', '借阅清单', '借阅账单']

const Index: React.FC = () => {
  const [current, setCurrent] = useState(0)
  const [show, setShow] = useState(false)

  const [data, setData] = useState<LibraryRes | null>(null)

  /**
   * 获取数据
   */
  const getData = async () => {
    await Taro.showLoading({
      mask: true,
      title: '加载中...'
    })
    try {
      const res = await getLibraryApi()
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
        title: err.toString()
      })
    } finally {
      Taro.hideLoading()
    }
  }

  useEffect(() => {
    void getData()
  }, [])

  const handleChangCurrent = (index: number): void => {
    setCurrent(index)
  }

  const onRefresh = async (close) => {
    await getData()
    close()
  }

  return (
    <View>
      <Tab items={items} current={current} onChange={handleChangCurrent}>
        <Panel current={current} index={0}>
          <PullRefresh topGap={68} runFunc={onRefresh}>
            {data && show && data.borrowing.length !== 0 ? (
              <View style={{ padding: 0 }}>
                <View className={styles.totalAmount}>{`共${data.borrowing.length}本书`}</View>
                {data.borrowing.map((item, index) => {
                  const temp = item.return_date.split('-')
                  const date = item.return_date.replace(/-/g, '/')
                  const rest = dayjs(new Date(+temp[0], +temp[1] - 1, +temp[2])).diff(dayjs(), 'day')
                  return (
                    <Card
                      key={`${date}-${item.title}`}
                      lineColor={onColors[index % onColors.length]}
                      renderLeft={<Left title={`${rest}天`} content='过期时间' />}
                      renderRight={
                        <Right
                          title={item.title}
                          renderContent={
                            <View style='font-size: 20rpx;'>
                              <View>{`${item.author}`}</View>
                              <View>{`${item.library}`}</View>
                              <View>到期：{date}</View>
                            </View>
                          }
                        />
                      }
                    />
                  )
                })}
              </View>
            ) : (
              <View className={styles.empty}>
                <Image src={book} className={styles.img} />
                <View className={styles.text}>没有借书记录，快去借书吧！</View>
              </View>
            )}
          </PullRefresh>
        </Panel>
        <Panel current={current} index={1}>
          <PullRefresh topGap={68} runFunc={onRefresh}>
            {data && show && data.borrowed.length !== 0 ? (
              <View style={{ padding: 0 }}>
                <View className={styles.totalAmount}>{`共借书${
                  (data.borrowed.length - data.borrowing.length) / 2 + data.borrowing.length
                }次，
                  还书${(data.borrowed.length - data.borrowing.length) / 2}次`}</View>
                {data.borrowed.map((item, index) => {
                  const date = item.time.replace(/-/g, '/')
                  return (
                    <Card
                      key={`${date}-${item.title}-${item.type}`}
                      lineColor={onColors[index % onColors.length]}
                      renderLeft={<Left title={date} content={item.type} />}
                      renderRight={
                        <Right
                          title={item.title}
                          renderContent={
                            <>
                              <View style='font-size: 20rpx;'>{`${item.author}`}</View>
                              <View style='font-size: 20rpx;'>{`${item.library}`}</View>
                            </>
                          }
                        />
                      }
                    />
                  )
                })}
              </View>
            ) : (
              <View className={styles.empty}>
                <Image src={book} className={styles.img} />
                <View className={styles.text}>没有借书记录，快去借书吧！</View>
              </View>
            )}
          </PullRefresh>
        </Panel>
        <Panel current={current} index={2}>
          <PullRefresh topGap={68} runFunc={onRefresh}>
            {data && show && data.finance.length !== 0 ? (
              <View>
                {data.finance.map((item) => {
                  return (
                    <DisplayCard title={item.fee_type} subTitle={item.cost} key={Math.random()} footer={item.time}>
                      <View>图书编号：{item.barcode}</View>
                      <View>产生地点：{item.place}</View>
                      <View>支付类型/状态：{item.pay_sign}</View>
                    </DisplayCard>
                  )
                })}
              </View>
            ) : (
              <View className={styles.empty}>
                <Image src={book} className={styles.img} />
                <View className={styles.text}>暂时没有账单</View>
              </View>
            )}
          </PullRefresh>
        </Panel>
      </Tab>
    </View>
  )
}

export default Index
