import { Image, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import dayjs from 'dayjs'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import styles from './index.module.scss'
import { getZhihuTagsJSON , getZhihuPageApi } from '@/apis/zhihu'

import Button from '@/components/Button'
import Card from '@/components/Card'
import PullRefresh from '@/components/PullRefresh'
import { Tabs } from '@/components/Tabs'
import useLayoutLatestRef from '@/utils/hooks/useLayoutLatestRef'
import usePromise from '@/utils/hooks/usePromise'
import useRefreshKey from '@/utils/hooks/useRefreshKey'
import { getBoundingClientRect } from '@/utils/tool'
import type { TagItem , IZhihu } from '@/apis/zhihu'


const DEFAULT_PANEL_INDEX = 0

const Index: React.FC = () => {
  // 处理下拉刷新
  const [refreshKey, refreshTrigger] = useRefreshKey()
  // 处理滚动到页面底部后的懒加载
  const [scrollToLowerKey, scrollToLowerTrigger] = useRefreshKey()
  // 知湖文章标签
  const [tags, loadingTags] = usePromise<string>(
    getZhihuTagsJSON,
    '[{"label":"","value":"加载中"}]',
    [getZhihuTagsJSON, refreshKey]
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

  const appendToZhihuPostList = useCallback(
    // TODO: https://github.com/NervJS/taro/discussions/12369
    async () => {
      const resRows = (
        await getZhihuPageApi({
          offset: zhihuPostListLengthRef.current,
          req_count: 15,
          tags: (JSON.parse(tags) as TagItem[])[currentTabIdx]!.value,
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
    [appendToZhihuPostList, scrollToLowerKey, refreshKey]
  )

  // 点击卡片，跳转到详情页
  const handlePostClick = useCallback((item: IZhihu) => {
    if (item.type === 'link') {
      void Taro.navigateTo({
        url: `/pages/webview/index?url=${item.content}&title=${item.title}&from=zhihu`,
      })
    } else {
      void Taro.navigateTo({
        url: `/pages/detail/index?id=${item.id}&title=${item.title}&publishTime=${item.publishTime}`,
      })
    }
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

  const panels = useMemo(
    () =>
      (JSON.parse(tags) as TagItem[]).map(item => ({
        key: item.value,
        title: item.label,
        component: <></>,
      })),
    [tags]
  )

  return (
    <View>
      {/* 顶部tab栏 */}
      <View className={styles.tabsWrapper}>
        <Tabs
          tabsClassName={styles.tabs}
          onSelect={setCurrentTabIdx}
          defaultPanelIndex={DEFAULT_PANEL_INDEX}
          panels={panels}
        />
      </View>
      <PullRefresh
        scrollViewProps={{
          onScrollToLower: scrollToLowerTrigger,
        }}
        topGap={0}
        runFunc={clearRefreshingState => {
          clearPullRefreshRefreshingState.current = clearRefreshingState
          refreshTrigger()
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
                    {item.publishTime && (
                      <View className={styles.publishTime}>
                        {dayjs(item.publishTime).format('YYYY-MM-DD')}
                      </View>
                    )}
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
          {(loadingTags || loadingZhihuPost) && (
            <View className={styles.loading}>加载中...</View>
          )}
        </View>
      </PullRefresh>

      {/* 发布按钮 */}
      <View className={styles.publishBtnWarpper}>
        <Button
          className={styles.publishBtn}
          onClick={() =>
            Taro.navigateTo({
              url: '/pages/informationAdd/index',
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
