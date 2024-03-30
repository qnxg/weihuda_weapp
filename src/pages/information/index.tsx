import { IZhihu, getZhihuPageApi } from '@/apis/zhihu'
import Button from '@/components/Button'
import Card from '@/components/Card'
import PullRefresh from '@/components/PullRefresh'
import { TabPanel, Tabs } from '@/components/Tabs'
import { getBoundingClientRect } from '@/utils/tool'
import { Image, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import dayjs from 'dayjs'
import React, { useEffect, useState } from 'react'
import styles from './index.module.scss'

//TODO: 可以从数据库获取标签后更新
const defaultTags = [
  {
    label: '首页',
    value: ''
  },
  {
    label: '讨论',
    value: '讨论'
  },
  {
    label: '失物招领',
    value: '失物招领'
  },
  {
    label: '活动',
    value: '活动'
  },
  {
    label: '讲座',
    value: '讲座'
  },
  {
    label: '通知',
    value: '通知'
  },
  {
    label: '其他',
    value: '其他'
  }
]

const Index: React.FC = () => {
  // 知湖页面数据
  const [data, setData] = useState<IZhihu[]>([])
  // 总数，分页时会用到
  const [total, setTotal] = useState(0)
  // 是否正在加载数据
  const [loading, setLoading] = useState(true)
  // 查询数据
  const [queryData, setQueryData] = useState({
    page: 1,
    pageSize: 10,
    tags: ''
  })

  // 获取知湖页面数据
  const getData = async (newQueryData: typeof queryData, force: boolean = false) => {
    setLoading(true)
    const res = await getZhihuPageApi(newQueryData)
    if (force) {
      setData(res.rows)
    } else {
      setData([...data, ...res.rows])
    }
    setTotal(res.count)
    setLoading(false)
  }

  // 切换标签，获取对应标签的数据
  const handleChange = (value: string) => {
    const newQueryData = { ...queryData, tags: value, page: 1 }
    setQueryData(newQueryData)
    getData(newQueryData, true)
  }

  // 点击卡片，跳转到详情页
  const handleClick = (item: IZhihu) => {
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

  const scrollToLower = () => {
    if (data.length >= total) return
    const newQueryData = { ...queryData, page: queryData.page + 1 }
    setQueryData(newQueryData)
    getData(newQueryData)
  }

  // 滑倒底部，会获取下一页的数据
  // useReachBottom(() => {
  //   console.log('reach bottom')
  //   if (data.length >= total) return
  //   const newQueryData = { ...queryData, page: queryData.page + 1 }
  //   setQueryData(newQueryData)
  //   getData(newQueryData)
  // })

  useEffect(() => {
    getData(queryData, true)
  }, [])

  // 下拉刷新
  const runRefresh = async (closer) => {
    const newQueryData = { ...queryData, page: 1 }
    setQueryData(newQueryData)
    await getData(newQueryData, true)
    closer()
  }

  // 设置padding-top，避免被顶部tab遮挡
  const [paddingTop, setPaddingTop] = useState(70)
  const updatePaddingTop = async () => {
    const rects = await getBoundingClientRect(`.${styles.tabsWrapper}`)
    setPaddingTop(rects[0].height + 4)
  }
  useEffect(() => {
    updatePaddingTop()
  }, [])

  return (
    <View>
      {/* 顶部tab栏 */}
      <View className={styles.tabsWrapper}>
        <Tabs tabsClassName={styles.tabs} onChange={handleChange}>
          {defaultTags.map((item) => (
            <TabPanel key={item.value} title={item.label} value={item.value}></TabPanel>
          ))}
          {/* <TabPanel title='首页' value=''></TabPanel>
          <TabPanel title='活动' value='活动'></TabPanel>
          <TabPanel title='讲座' value='讲座'></TabPanel>
          <TabPanel title='通知' value='通知'></TabPanel> */}
        </Tabs>
      </View>
      <PullRefresh
        scrollViewProps={{
          onScrollToLower: scrollToLower
        }}
        topGap={0}
        runFunc={runRefresh}
      >
        {/* 文章列表 */}
        <View
          className={styles.contentWrapper}
          style={{
            paddingTop: `${paddingTop}px`
          }}
        >
          {data.map((item) => {
            return (
              <Card
                key={item.id}
                wrapperClassName={styles.articleItemWrapper}
                className={styles.articleItem}
                hoverClass={styles.active}
                onClick={() => handleClick(item)}
              >
                <View className={styles.left}>
                  <View className={styles.title}>{item.title}</View>
                  {item.status !== 1 && (
                    <View className={styles.status}>{item.status == 0 ? '审核中' : '审核未通过'}</View>
                  )}
                  {item.publishTime && (
                    <View className={styles.publishTime}>{dayjs(item.publishTime).format('YYYY-MM-DD')}</View>
                  )}
                </View>
                {item.cover && (
                  <View className={styles.cover}>
                    <Image src={item.cover} mode='aspectFill' />
                  </View>
                )}
                {/* <View>{item.content}</View> */}
              </Card>
            )
          })}
          {loading && <View className={styles.loading}>加载中...</View>}
        </View>
      </PullRefresh>

      {/* 发布按钮 */}
      <View className={styles.publishBtnWarpper}>
        <Button
          className={styles.publishBtn}
          onClick={() =>
            Taro.navigateTo({
              url: '/pages/informationAdd/index'
            })
          }
        >
          发布
        </Button>
      </View>
    </View>
  )
}

export default Index
