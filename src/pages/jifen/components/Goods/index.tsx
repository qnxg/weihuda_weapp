import { IJifenGoods, getJifenGoodsPageApi } from '@/apis/jifen'
import Button from '@/components/Button'
import { Image, View } from '@tarojs/components'
import React, { useEffect } from 'react'
import styles from './index.module.scss'

const Goods: React.FC = () => {
  const [loading, setLoading] = React.useState(true)
  const [data, setData] = React.useState<IJifenGoods[]>([])

  const getData = async () => {
    const res = await getJifenGoodsPageApi({
      page: 1,
      pageSize: 20
    })
    setLoading(false)
    if (res) {
      setData(res.rows)
    }
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <View className={styles.goodsContainer}>
      <View>
        {data.map((item) => (
          <View key={item.id} className={styles.goodsItem}>
            <View className={styles.left}>
              <View>
                <Image className={styles.goodsImg} src={item.cover.replace('http', 'https')} mode='aspectFit' />
              </View>
              <View className={styles.goodsInfo}>
                <View className={styles.goodsName}>{item.name}</View>
                <View className={styles.extera}>
                  <View className={styles.goodsPrice}>{item.price}积分</View>
                  <View className={styles.goodsCount}>剩余: {item.count}</View>
                </View>
              </View>
            </View>
            <Button className={styles.goodsBtn} theme='primary'>
              兑换
            </Button>
          </View>
        ))}
        {/* <View className={styles.goodsItem}>
          <View className={styles.left}>
            <View>
              <Image className={styles.goodsImg} src='https://img.yzcdn.cn/vant/ipad.jpeg' mode='aspectFit' />
            </View>
            <View className={styles.goodsInfo}>
              <View className={styles.goodsName}>iPad</View>
              <View className={styles.extera}>
                <View className={styles.goodsPrice}>10000积分</View>
                <View className={styles.goodsCount}>剩余: 100</View>
              </View>
            </View>
          </View>
          <Button className={styles.goodsBtn} theme='primary'>
            兑换
          </Button>
        </View> */}
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
