import { Image, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import dayjs from 'dayjs'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import styles from './index.module.scss'
import { getZhihuItemLink, getZhihuPageApi, getZhihuTags } from '@/apis/zhihu'

import Card from '@/components/Card'
import PullRefresh from '@/components/PullRefresh'
import { Tabs } from '@/components/Tabs'
import useLayoutLatestRef from '@/utils/hooks/useLayoutLatestRef'
import usePromise from '@/utils/hooks/usePromise'
import useRefreshKey from '@/utils/hooks/useRefreshKey'
import { getBoundingClientRect } from '@/utils/tool'
import type { IZhihu, IZhihuTagItem } from '@/apis/zhihu'

const DEFAULT_PANEL_INDEX = 0

const Index: React.FC = () => {
  // 处理下拉刷新
  const [refreshKey, refreshTrigger] = useRefreshKey()
  // 处理滚动到页面底部后的懒加载
  const [scrollToLowerKey, scrollToLowerTrigger] = useRefreshKey()
  // 知湖文章标签
  const [tags, loadingTags] = usePromise<IZhihuTagItem[]>(
    getZhihuTags,
    [],
    [getZhihuTags, refreshKey]
  )
  // 当前选项卡序号
  const [currentTabIdx, setCurrentTabIdx] = useState(DEFAULT_PANEL_INDEX)
  // 知湖文章列表
  const [zhihuPostList, setZhihuPostList] = useState<IZhihu[]>([])
  // 知湖文章列表长度
  const zhihuPostListLengthRef = useLayoutLatestRef(zhihuPostList.length)
  useEffect(() => {
    setZhihuPostList([])
    zhihuPostListLengthRef.current = 0 // 让后续append的effect能立即得到最新的值
  }, [refreshKey, currentTabIdx, zhihuPostListLengthRef])

  // 取消下拉刷新组件的下拉刷新状态的回调函数，见PullRefresh组件
  const clearPullRefreshRefreshingState = useRef(() => {})

  // 是否正在下拉刷新
  const [isRefreshing, setIsRefreshing] = useState(false)

  const appendToZhihuPostList = useCallback(
    // TODO: https://github.com/NervJS/taro/discussions/12369
    async () => {
      const tag = tags[currentTabIdx]
      if (!tag) return // tags 尚未加载完成时不请求
      const resRows = (
        await getZhihuPageApi({
          offset: zhihuPostListLengthRef.current,
          req_count: 15,
          tags: tag.value,
        })
      ).rows
      setZhihuPostList(oldList => [...oldList, ...resRows])
      clearPullRefreshRefreshingState.current()
    },
    [zhihuPostListLengthRef, tags, currentTabIdx]
  )
  const [_, loadingZhihuPost] = usePromise<void>(
    appendToZhihuPostList,
    undefined,
    // 不再依赖 refreshKey。refreshKey 变化会使得 tags 变化，进而使得 appendToZhihuPostList 变化，从而使得这里的 usePromise 触发，进而达到更新的目的
    [appendToZhihuPostList, scrollToLowerKey]
  )

  // 点击卡片，跳转到详情页
  const handlePostClick = useCallback((item: IZhihu) => {
    const url = getZhihuItemLink(item)
    void Taro.navigateTo({ url })
  }, [])

  // 设置padding-top，避免被顶部tab遮挡
  // TODO: 研究这段代码怎么工作的以及是否存在替代方法
  const calcPaddingTop = useCallback(async () => {
    await new Promise(res => setTimeout(res, 200))
    const rects = await getBoundingClientRect(`.${styles.tabsWrapper}`)
    return rects[0]!.height + 4
  }, [])
  const [paddingTop] = usePromise(calcPaddingTop, 70, [
    calcPaddingTop,
    refreshKey,
    tags,
  ])

  const panels = useMemo(() => {
    return tags.map(item => ({
      key: item.value,
      title: item.label,
      component: <></>,
    }))
  }, [tags])

  return (
    <View>
      {/* 顶部tab栏：tags 异步加载，有数据后再渲染 Tabs，避免空 panels + defaultPanelIndex=0 导致报错 */}
      <View className={styles.tabsWrapper}>
        {panels.length > 0 && (
          <Tabs
            tabsClassName={styles.tabs}
            onSelect={setCurrentTabIdx}
            defaultPanelIndex={DEFAULT_PANEL_INDEX}
            panels={panels}
          />
        )}
      </View>
      <PullRefresh
        scrollViewProps={{
          onScrollToLower: scrollToLowerTrigger,
        }}
        topGap={0}
        runFunc={clearRefreshingState => {
          clearPullRefreshRefreshingState.current = () => {
            clearRefreshingState()
            setIsRefreshing(false)
          }
          refreshTrigger()
          setIsRefreshing(true)
        }}
      >
        {/* 文章列表 */}
        <View
          className={styles.contentWrapper}
          style={{
            paddingTop: `${paddingTop}px`,
          }}
        >
          {zhihuPostList.map(item => {
            return (
              <Card
                key={item.id}
                wrapperClassName={styles.articleItemWrapper}
                className={styles.articleItem}
                hoverClass={styles.active}
                onClick={() => handlePostClick(item)}
              >
                <View className={styles.left}>
                  <View className={styles.title}>{item.title}</View>
                  <View className={styles.exteraInfo}>
                    <View className={styles.publishTime}>
                      {dayjs(item.createdAt).format('YYYY-MM-DD')}
                    </View>
                    {item.status !== 1 && (
                      <View className={styles.status}>
                        {item.status == 0 ? '审核中' : '审核未通过'}
                      </View>
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
          {/* 如果是正在下拉刷新，则不显示加载中 */}
          {!isRefreshing && (loadingTags || loadingZhihuPost) && (
            <View className={styles.loading}>加载中...</View>
          )}
        </View>
      </PullRefresh>
    </View>
  )
}

export default Index
