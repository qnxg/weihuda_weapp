import { getZhihuPageApi, IZhihu } from '@/apis/zhihu'
import Card from '@/components/Card'
import CardHeader from '@/components/Card/CardHeader'
import cardIcon from '@/static/index/icon/information.svg'
import { Image, Swiper, SwiperItem, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import dayjs from 'dayjs'
import React, { useEffect, useState } from 'react'
import styles from './index.module.scss'

const HomeSwiper: React.FC = () => {
  const [latestArticles, setLatestArticles] = useState<IZhihu[]>([])

  // 获取最新的6篇文章
  const fetchLatestArticles = async () => {
    try {
      const res = await getZhihuPageApi({ page: 1, pageSize: 6, tags: '' })
      setLatestArticles(res.rows)
    } catch (error) {
      console.error('获取最新文章失败:', error)
    }
  }

  useEffect(() => {
    fetchLatestArticles()
  }, [])

  // 点击轮播图跳转到详情页
  const handleClick = (item) => {
    if (item.type === 'link') {
      Taro.navigateTo({
        url: `/pages/webview/index?url=${item.content}&title=${item.title}&from=zhihu`
      })
    } else {
      Taro.navigateTo({
        url: `/pages/detail/index?id=${item.id}&title=${item.title}&publishTime=${item.publishTime}`
      })
    }
  }

  return (
    <View>
      <Card>
        <CardHeader title='今日知湖' icon={cardIcon} />
        <Swiper
          className={styles.swiper}
          autoplay
          interval={5000}
          circular
          indicatorDots
          indicatorActiveColor="#007aff"
          style={{ height: '120px' }}
        >
          {latestArticles.map((item) => (
            <SwiperItem key={item.id} onClick={() => handleClick(item)} style={
              {
                height: '120px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }
            }>
              <Card
                key={item.id}
                wrapperClassName={styles.articleItemWrapper}
                className={styles.articleItem}
                hoverClass={styles.active}
              >
                <View className={styles.left}>
                  <View className={styles.title}>{item.title}</View>
                  <View className={styles.exteraInfo}>
                    {item.publishTime && (
                      <View className={styles.publishTime}>{dayjs(item.publishTime).format('YYYY-MM-DD')}</View>
                    )}
                    {item.status !== 1 && (
                      <View className={styles.status}>{item.status == 0 ? '审核中' : '审核未通过'}</View>
                    )}
                  </View>
                </View>
                {item.cover && (
                  <View className={styles.cover}>
                    <Image src={item.cover} mode='aspectFill' />
                  </View>
                )}
              </Card>
            </SwiperItem>
          ))}
        </Swiper>
      </Card>
    </View>
  )
}

export default HomeSwiper