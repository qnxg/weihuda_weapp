import { Image, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import dayjs from 'dayjs'
import React, { useEffect, useState } from 'react'
import defaultTags from './defaultTags'
import styles from './index.module.scss'
import { getMiniConfigPageApi } from '@/apis/miniConfig'
import { IZhihu, getZhihuPageApi } from '@/apis/zhihu'
import Button from '@/components/Button'
import Card from '@/components/Card'
import PullRefresh from '@/components/PullRefresh'
import { TabPanel, Tabs } from '@/components/Tabs'
import { getBoundingClientRect, parseJSON } from '@/utils/tool'

const Index: React.FC = () => {
  // 标签
  const [tags, setTags] = useState(defaultTags)
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

  // 获取tags
  const getTags = async () => {
    const res = await getMiniConfigPageApi({ page: 1, pageSize: 100, key: 'zhihuTags' })
    if (res.rows.length) {
      // 先解析，没有报错就存储
      const resTags = parseJSON(res.rows[0].value)
      Taro.setStorageSync('zhihuTags', res.rows[0].value)
      setTags(resTags)
    }
  }

  // 获取知湖页面数据
  const getData = async (newQueryData: typeof queryData, force: boolean = false) => {
    setLoading(true)
    const res = await getZhihuPageApi(newQueryData)
    if (force) {
      // 切换标签时，直接替换数据
      setData(res.rows)
    } else {
      // 滑倒底部（分页）时，追加数据
      setData([...data, ...res.rows])
    }
    setTotal(res.count)
    setLoading(false)
  }

  // 切换标签，获取对应标签的数据
  const handleChange = (value: string) => {
    const newQueryData = { ...queryData, tags: value, page: 1 }
    setQueryData(newQueryData)
    void getData(newQueryData, true)
  }

  // 点击卡片，跳转到详情页
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

  const scrollToLower = () => {
    if (data.length >= total) return
    const newQueryData = { ...queryData, page: queryData.page + 1 }
    setQueryData(newQueryData)
    void getData(newQueryData)
  }

  useEffect(() => {
    void getData(queryData, true)
    void getTags()
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
    void updatePaddingTop()
  }, [])

  return (
    <View>
      {/* 顶部tab栏 */}
      <View className={styles.tabsWrapper}>
        <Tabs tabsClassName={styles.tabs} onChange={handleChange}>
          {tags.map((item) => (
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
