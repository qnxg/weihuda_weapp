import { ScrollView, View } from '@tarojs/components'
import classNames from 'classnames'
import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import styles from './index.module.scss'
import useLayoutLatestRef from '@/utils/hooks/useLayoutLatestRef'
import { getBoundingClientRect, getScrollOffset } from '@/utils/tool'
import type { ViewProps } from '@tarojs/components'

interface ITabsProps extends ViewProps {
  /**
   * 各个子选项卡
   *
   * 该列表不允许为空
   *
   * 当且仅当该列表发生改变（引用意义上的），组件会重新遍历该列表并设置子选项卡。
   *
   * 如果你想避免不必要的重渲染，请使用`useMemo`。
   *
   * 如果你想要触发重渲染，请不要就地更改数组：请确保传入一个新的数组引用。
   */
  panels: IPanelData[]
  /**
   * 默认选中的 Tab 在`panels`数组上的索引
   *
   * 如果它发生改变，组件会重新初始化。
   *
   * 默认为0。
   */
  defaultPanelIndex?: number
  /**
   * 顶部 Tab 的样式类名
   */
  tabsClassName?: string
  /**
   * Tab 内容容器的样式类名
   */
  contentClassName?: string
  /**
   * 是否同时保持渲染所有 Tab （含未显示的），默认为 false
   */
  loadAll?: boolean
  /**
   * 选中子选项卡时的回调函数
   *
   * 该函数也会在开始时在默认选中的子选项卡上调用。
   *
   * **如果该函数发生变化，则新的函数会立即被调用**
   *
   * @param index 新选中的 Tab 索引
   */
  onSelect?: (value: number) => void
}

export interface IPanelData {
  /**
   * Tab 键
   *
   * 起到唯一标识作用，且可能作为组件`key`属性用于渲染某些组件列表。
   *
   * 该字段在传入`Tab`组件的`panels`数组中必须是唯一的，
   * 且还有一些语义上的限制，详情见某些对关于React组件的key属性的文档。
   *
   * 如果未设置，默认使用`title`作为键。
   *
   * @see https://react.dev/learn/rendering-lists#why-does-react-need-keys
   */
  key?: number | string
  /**
   * Tab 标题
   */
  title: string
  /**
   * 组件
   */
  component: React.ReactNode
}

/**
 * Tabs 组件
 */
export const Tabs: React.FC<ITabsProps> = props => {
  const { panels, defaultPanelIndex: initialPanelIndex, onSelect } = props

  // 当前选中的 Tab
  const [currentTab, setCurrentTab] = useState(initialPanelIndex ?? 0)
  const currentTabRef = useLayoutLatestRef(currentTab)
  // activeLine 的位置
  const [activeLineLeft, setActiveLineLeft] = useState(0)

  // 更新 activeLine 的位置
  // TODO: 搞明白这个是在干什么，证明它是正确的，以及有无替代方案
  const updateActiveLine = useCallback(async (newIdx: number) => {
    const [{ scrollLeft }, scrollViewRects, rects, activeLineRects] =
      await Promise.all([
        getScrollOffset('.tabsScrollView'),
        getBoundingClientRect('.tabsScrollView'),
        getBoundingClientRect('.tab-item'),
        getBoundingClientRect(`.${styles.activeLine}`),
      ])
    const activeRect = rects[newIdx]
    setActiveLineLeft(
      activeRect.left +
        scrollLeft -
        scrollViewRects[0].left +
        activeRect.width / 2 -
        activeLineRects[0].width / 2
    )
  }, [])

  const handleTabSelect = useCallback(
    async (idx: number) => {
      setCurrentTab(idx)
      if (onSelect) {
        onSelect(idx)
      }
      await updateActiveLine(idx)
    },
    [onSelect, updateActiveLine]
  )

  useEffect(() => {
    void (async () => {
      await new Promise(res => setTimeout(res, 200))
      if (currentTab != currentTabRef.current) {
        return
      }
      await updateActiveLine(currentTabRef.current)
    })()
  }, [currentTab, currentTabRef, updateActiveLine])

  // 初始时在默认选项卡上调用`onSelect`
  useLayoutEffect(() => {
    void handleTabSelect(initialPanelIndex ?? 0)
  }, [initialPanelIndex, updateActiveLine, panels, handleTabSelect])

  if (panels.length <= currentTab) {
    throw Error(`选项卡个数为${panels.length}，然而当前选项卡id为${currentTab}`)
  }

  return (
    <View>
      <ScrollView
        enhanced
        showScrollbar={false}
        scrollX
        className={classNames(styles.tabsScrollView, 'tabsScrollView')}
      >
        <View className={classNames(styles.tabs, props.tabsClassName)}>
          {panels.map((panel, idx) => (
            <View
              key={panel.key ?? panel.title}
              className={classNames(
                styles.tabItem,
                {
                  [styles.active]: currentTab === idx,
                },
                'tab-item'
              )}
              onClick={() => handleTabSelect(idx)}
            >
              {panel.title}
            </View>
          ))}
          <View
            className={styles.activeLine}
            style={{
              transform: `translateX(${activeLineLeft}px)`,
            }}
          ></View>
        </View>
      </ScrollView>
      {props.loadAll ? (
        panels.map((panel, idx) => {
          return (
            <View
              key={panel.key ?? panel.title}
              className={classNames(props.contentClassName, {
                [styles.hidden]: currentTab !== idx,
              })}
            >
              {panel.component}
            </View>
          )
        })
      ) : (
        <View className={classNames(props.contentClassName)}>
          {panels[currentTab].component}
        </View>
      )}
    </View>
  )
}
