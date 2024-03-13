import { ZhihuItem, getZhihuList } from '@/apis/zhihu'
import Tab from '@/components/Tab'
import Panel from '@/components/Tab/components/Panel'
import { View } from '@tarojs/components'
import Taro, { useReachBottom } from '@tarojs/taro'
import React, { useEffect, useMemo, useState } from 'react'
import Card from './components/Card'
import LostFoundCard, { LostAndFoundArticle } from './components/LostFoundCard'
import styles from './index.module.scss'

// const items: Array<string> = ['首页', '活动', '讲座', '通知', '失物招领']
const items: Array<string> = ['首页', '活动', '讲座', '通知']

const Index: React.FC = () => {
  const [page, setPage] = useState<number[]>([1, 1, 1, 1, 1]) // 分页，当前面板滑倒底部时会按照页数请求数据
  const [kind, setKind] = useState(0) // 当前tab的索引
  const [article, setArticle] = useState<ZhihuItem[][] & LostAndFoundArticle[][]>([[], [], [], [], []]) // 文章列表

  // 发布完一条失物招领帖之后回到列表页时无法看到自己刚刚发布的帖子，
  // 所以，定义一个全局事件，事件里面初始化掉页数和已经获取的文章列表
  // 好让页面重新发起请求获取
  Taro.eventCenter.on('lfArticlePublishDone', () => {
    const [...newPage] = page
    // 返回顶部
    newPage[kind] = 1
    const [...newArticle] = article
    // 清空，以便重新获取
    newArticle[kind] = []
    setArticle(newArticle)
    setPage(newPage)
  })

  // 滑倒底部，会获取下一页的数据
  useReachBottom(() => {
    const [...newPage] = page
    newPage[kind] += 1
    getData()
    setPage(newPage)
  })

  // 获取知湖列表
  const getData = async () => {
    try {
      // 发起请求
      let res
      if (kind == 4) {
        // TODO: 失物招领
      } else {
        res = await getZhihuList(kind, page[kind])
      }
      // 设置数据
      const newArticle = JSON.parse(JSON.stringify(article))
      newArticle[kind] = [...newArticle[kind], ...res.content]
      setArticle(newArticle)
    } catch (err) {
      Taro.showToast({
        icon: 'none',
        title: err.toString()
      })
    }
  }

  // 换tab或者分页信息发生变化时需要重新获取数据
  // 单独处理失物招领
  useEffect(() => {
    if (article[kind].length === 0) {
      getData()
    }
  }, [kind])

  const helperArr = useMemo(() => new Array(4).fill(0), [])
  return (
    <View className={styles.outer}>
      <Tab items={items} current={kind} onChange={setKind}>
        {helperArr.map((_, index) => (
          <Panel current={kind} index={index} key={String(items[index])}>
            <View className={styles.container}>
              {article[index].map((item) => (
                <Card item={item} key={item.title} />
              ))}
              <View className={styles.loading}>正在加载...</View>
            </View>
          </Panel>
        ))}
        {/* 以下是失物招领面板 */}
        {kind == 4 && (
          <Panel current={kind} index={kind}>
            <View className={styles.container}>
              {article[kind].map((v) => (
                <LostFoundCard key={v.id} data={v as unknown as LostAndFoundArticle} />
              ))}
              {/* <LostFoundCard /> */}
              {/* <View className={styles.loading}>正在加载...</View> */}
            </View>
          </Panel>
        )}
      </Tab>
      {/* 这是下面的发帖按钮 */}
      {kind == 4 && (
        <View
          className={styles.addBtn}
          onClick={() => {
            Taro.navigateTo({
              url: '/pages/lostFoundAdd/index'
            })
          }}
        />
      )}
    </View>
  )
}

export default Index
