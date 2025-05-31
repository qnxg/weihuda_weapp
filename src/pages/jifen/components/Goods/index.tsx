import { Image, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import dayjs from 'dayjs'
import React, { useEffect, useState } from 'react'
import styles from './index.module.scss'
import { getJifenGoodsPageApi, postGoodsRecordApi } from '@/apis/jifen'
import Button from '@/components/Button'
import type { IJifenGoods } from '@/apis/jifen'

interface IGoodsProps {
  total?: number
  updateTotal?: () => void
  updateJifenRecord?: () => void
}

const Goods: React.FC<IGoodsProps> = props => {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<IJifenGoods[]>([])
  const [exchangeLoading, setExchangeLoading] = useState(false)
  const total = props.total || 0

  // 获取列表数据
  const getData = async () => {
    const res = await getJifenGoodsPageApi({
      page: 1,
      pageSize: 20,
    })
    setLoading(false)
    if (res) {
      setData(res.rows)
    }
  }

  // 兑换奖品
  const exchangeGoods = async (id: number) => {
    if (exchangeLoading) return
    setExchangeLoading(true)

    // 显示确认框
    const modalRes = await Taro.showModal({
      title: '提示',
      content: '确定兑换吗？',
    })

    if (!modalRes.confirm) {
      setExchangeLoading(false)
      return
    }
    await Taro.showLoading({ title: '兑换中...' })
    const res = await postGoodsRecordApi({
      goodsId: id,
      exchangeTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    })
    console.log(res)
    if (res) {
      await Taro.showToast({
        title: '兑换成功',
        icon: 'success',
      })
      setExchangeLoading(false)
      await getData()
      if (props.updateTotal) {
        props.updateTotal()
      }
      if (props.updateJifenRecord) {
        props.updateJifenRecord()
      }
    }
  }

  const getBtnText = (item: IJifenGoods) => {
    if (item.count <= 0) {
      return '已兑完'
    }
    if (item.price > total) {
      return '积分不足'
    }
    return '兑换'
  }

  useEffect(() => {
    void getData()
  }, [])

  return (
    <View className={styles.goodsContainer}>
      <View>
        {data.map(item => (
          <View key={item.id} className={styles.goodsItem}>
            <View className={styles.left}>
              <View>
                <Image
                  className={styles.goodsImg}
                  src={item.cover.replace('http:', 'https:')}
                  mode='aspectFit'
                />
              </View>
              <View className={styles.goodsInfo}>
                <View className={styles.goodsName}>{item.name}</View>
                <View className={styles.extera}>
                  <View className={styles.goodsPrice}>{item.price}积分</View>
                  <View className={styles.goodsCount}>
                    剩余: {item.count}件
                  </View>
                </View>
              </View>
            </View>
            <Button
              disabled={item.count <= 0 || item.price > total}
              className={styles.goodsBtn}
              theme={
                item.count <= 0 || item.price > total ? 'default' : 'primary'
              }
              onClick={() => exchangeGoods(item.id)}
            >
              {getBtnText(item)}
            </Button>
          </View>
        ))}
      </View>
      {data.length === 0 && (
        <View className={styles.empty}>
          <View>{loading ? '加载中...' : '暂无数据'}</View>
        </View>
      )}
    </View>
  )
}

export default Goods
