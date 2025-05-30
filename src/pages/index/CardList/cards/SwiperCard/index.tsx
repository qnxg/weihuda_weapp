import { Image, Swiper, SwiperItem, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import dayjs from 'dayjs'
import React, { useCallback, useEffect } from 'react'
import styles from './index.module.scss'
import { getZhihuPageApi } from '@/apis/zhihu'
import Card from '@/components/Card'
import CardHeader from '@/components/Card/CardHeader'
import cardIcon from '@/static/index/icon/information.svg'
import usePromise from '@/utils/hooks/usePromise'
import type CardProps from '../../CardProps'
import type { IZhihu } from '@/apis/zhihu';

const HomeSwiperCard: React.FC<CardProps> =
  ({ onLoadingStatusChange,
    reloadController
  }) => {

    const fetchLatestArticles =
      useCallback(async () =>
        (await getZhihuPageApi({ page: 1, pageSize: 6, tags: '' })).rows, [])
    const [latestArticles, isLatestArticlesLoading, latestArticlesError] =
      usePromise(fetchLatestArticles, [], [reloadController]);
    useEffect(() => {
      onLoadingStatusChange(isLatestArticlesLoading)
    }, [isLatestArticlesLoading, onLoadingStatusChange])
    useEffect(() => {
      if (latestArticlesError) {
        console.error('获取最新文章失败:', latestArticlesError.thrown)
      }
    }, [latestArticlesError])

    // 点击轮播图跳转到详情页
    const handleClick = (item: IZhihu) => {
      if (item.type === 'link') {
        void Taro.navigateTo({
          url: `/pages/webview/index?url=${item.content}&title=${item.title}&from=zhihu`
        })
      } else {
        void Taro.navigateTo({
          url: `/pages/detail/index?id=${item.id}&title=${item.title}&publishTime=${item.publishTime}`
        })
      }
    }

    // 没有拿到数据不显示这个卡片
    if (latestArticles.length == 0) { return <></> };
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
              <SwiperItem
                key={item.id}
                onClick={() => handleClick(item)}
                className={styles.swiperItem}
              >
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
                      <Image className={styles.Image} src={item.cover} mode='aspectFill' />
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

export default HomeSwiperCard