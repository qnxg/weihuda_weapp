import { IZhihu } from '@/apis/zhihu'
import Card from '@/components/Card'
import { TabPanel, Tabs } from '@/components/Tabs'
import { Image, View } from '@tarojs/components'
import Taro, { useReachBottom } from '@tarojs/taro'
import dayjs from 'dayjs'
import React, { useEffect, useState } from 'react'
import styles from './index.module.scss'

const Index: React.FC = () => {
  const [data, setData] = useState<IZhihu[]>([
    {
      id: 13,
      title: '格式检查',
      type: 'article',
      tags: '活动',
      cover: 'http://qnxg.cn/upload-2023/editor-test/1711115495793.jpg',
      content: null,
      status: 1,
      publishTime: '2024-03-22T13:48:31.000Z',
      stuId: '201909060601'
    },
    {
      id: 12,
      title: '湖南大学食堂文明用餐倡议书',
      type: 'link',
      tags: '活动',
      cover: null,
      content: 'https://mp.weixin.qq.com/s/MSv80EYBtuQ7DBIDUABHyA',
      status: 1,
      publishTime: '2024-03-22T13:25:38.000Z',
      stuId: '201909060601'
    },
    {
      id: 11,
      title: '纵向的封面',
      type: 'article',
      tags: '活动',
      cover: 'http://qnxg.cn/upload-2023/editor-test/1711113478231.jpg',
      status: 1,
      publishTime: '2024-03-22T13:16:27.000Z',
      stuId: '201909060601'
    },
    {
      id: 10,
      title: '横向的封面',
      type: 'article',
      tags: '讲座',
      cover: 'http://qnxg.cn/upload-2023/editor-test/1711113378232.jpg',
      status: 1,
      publishTime: '2024-03-22T13:16:07.000Z',
      stuId: '201909060601'
    },
    {
      id: 9,
      title: '模型实例很长很长超级长特别长的以恶搞标题模型实例很长很长超级长特别长的以恶搞标题',
      type: 'article',
      tags: '活动',
      cover: 'http://qnxg.cn/upload-2023/editor-test/1711110957117.jpg',
      status: 1,
      publishTime: '2024-03-22T12:35:54.000Z',
      stuId: '201909060601'
    },
    {
      id: 8,
      title: '模型实例很长很长超级长特别长的以恶搞标题模型实例很长很长超级长特别长的以恶搞标题',
      type: 'article',
      tags: '活动',
      cover: null,
      status: 1,
      publishTime: '2024-03-22T10:41:12.000Z',
      stuId: '202108010501'
    },
    {
      id: 8,
      title: '问题排查指南',
      type: 'article',
      tags: '活动',
      cover: null,
      status: 1,
      publishTime: '2024-03-22T10:41:12.000Z',
      stuId: '202108010501'
    },
    {
      id: 7,
      title: '文章1',
      type: 'article',
      tags: '活动',
      cover: null,
      status: 1,
      publishTime: '2024-03-22T02:58:39.000Z',
      stuId: '201909060601'
    }
  ])

  const getData = async () => {
    // const res = await getZhihuPageApi({ page: 1, pageSize: 10 })
    // console.log(res)
    // setData(res.rows)
  }

  const handleClick = (item: IZhihu) => {
    console.log('click', item)
    Taro.navigateTo({
      url: `/pages/detail/index?id=${item.id}&title=${item.title}&publishTime=${item.publishTime}`
    })
  }

  // 滑倒底部，会获取下一页的数据
  useReachBottom(() => {
    console.log('reach bottom')
  })

  useEffect(() => {
    getData()
  }, [])

  return (
    <View>
      <View className={styles.tabsWrapper}>
        <Tabs tabsClassName={styles.tabs} onChange={getData}>
          <TabPanel title='首页' value={0}></TabPanel>
          <TabPanel title='活动' value={1}></TabPanel>
          <TabPanel title='讲座' value={2}></TabPanel>
          <TabPanel title='通知' value={4}></TabPanel>
        </Tabs>
      </View>

      <View className={styles.contentWrapper}>
        {data.map((item) => (
          <Card
            key={item.id}
            wrapperClassName={styles.articleItemWrapper}
            className={styles.articleItem}
            hoverClass={styles.active}
            onClick={() => handleClick(item)}
          >
            <View className={styles.left}>
              <View className={styles.title}>{item.title}</View>
              <View className={styles.publishTime}>{dayjs(item.publishTime).format('YYYY-MM-DD')}</View>
            </View>
            {item.cover && (
              <View className={styles.cover}>
                <Image src={item.cover} mode='aspectFill' />
              </View>
            )}
            {/* <View>{item.content}</View> */}
          </Card>
        ))}
      </View>
    </View>
  )
}

export default Index
