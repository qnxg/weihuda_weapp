import { ScrollView, View } from '@tarojs/components'
import classNames from 'classnames'
import React, { useCallback, useEffect, useState } from 'react'
import styles from './index.module.scss'
import { getBoundingClientRect, getScrollOffset } from '@/utils/tool'
import type { ViewProps } from '@tarojs/components'
import type { ReactNode } from 'react'

interface ITabsProps extends ViewProps {
  /**
   * 默认选中的 Tab 索引
   */
  initialValue?: number
  /**
   * 顶部 Tab 的样式类名
   */
  tabsClassName?: string
  /**
   * Tab 内容容器的样式类名
   */
  contentClassName?: string
  /**
   * 是否缓存 TabPanel 组件，默认为 false
   */
  keepAlive?: boolean
  /**
   * 切换 Tab 时的回调函数
   * @param index 新选中的 Tab 索引
   */
  onChange?: (value: string | number) => void
}

interface IPanelData {
  /**
   * Tab 索引
   */
  value: number | string
  /**
   * Tab 标题
   */
  title: string
  /**
   * TabPanel 组件
   */
  component: React.ReactNode
}

/**
 * Tabs 组件
 * @example
 *  <Tabs>
 *   <TabPanel value={0} title='兑换奖品'>
 *     兑换奖品
 *   </TabPanel>
 *   <TabPanel value={1} title='积分记录'>
 *     积分记录
 *   </TabPanel>
 *   <TabPanel value={2} title='积分规则'>
 *     积分规则
 *   </TabPanel>
 * </Tabs>
 */
export const Tabs: React.FC<ITabsProps> = props => {
  // 获取所有的 TabPanel 组件
  const panels: IPanelData[] = (props.children! as ReactNode[]).map(
    (child: any) => {
      return {
        value: child.props.value,
        title: child.props.title,
        component: child,
      }
    }
  )

  const initialTabIndex =
    props.initialValue !== undefined ? props.initialValue : panels[0].value
  // 当前选中的 Tab
  const [currentTab, setCurrentTab] = useState(initialTabIndex)
  // activeLine 的位置
  const [activeLineLeft, setActiveLineLeft] = useState(0)
  // 获取当前选中的 TabPanel 组件
  const getCurrentPanel = () => {
    return panels.find(panel => panel.value === currentTab)!.component
  }

  // 更新 activeLine 的位置
  const updateActiveLine = useCallback(
    async newValue => {
      const { scrollLeft } = await getScrollOffset('.tabsScrollView')
      const scrollViewRects = await getBoundingClientRect('.tabsScrollView')
      const rects = await getBoundingClientRect('.tab-item')
      const activeLineRects = await getBoundingClientRect(
        `.${styles.activeLine}`
      )
      const activeIndex = panels.findIndex(panel => panel.value === newValue)
      const activeRect = rects[activeIndex]
      setActiveLineLeft(
        activeRect.left +
          scrollLeft -
          scrollViewRects[0].left +
          activeRect.width / 2 -
          activeLineRects[0].width / 2
      )
    },
    [panels]
  )

  const handleTabClick = async value => {
    await updateActiveLine(value)
    setCurrentTab(value)
    if (props.onChange) {
      props.onChange(value)
    }
  }

  useEffect(() => {
    void updateActiveLine(initialTabIndex)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialTabIndex])

  return (
    <View>
      <ScrollView
        enhanced
        showScrollbar={false}
        scrollX
        className={classNames(styles.tabsScrollView, 'tabsScrollView')}
      >
        <View className={classNames(styles.tabs, props.tabsClassName)}>
          {panels.map(panel => (
            <View
              key={panel.value}
              className={classNames(
                styles.tabItem,
                {
                  [styles.active]: currentTab === panel.value,
                },
                'tab-item'
              )}
              onClick={() => handleTabClick(panel.value)}
            >
              {panel.title}
            </View>
          ))}
          <View
            className={styles.activeLine}
            style={{
              transform: `translateX(${activeLineLeft}px)`,
              // left: activeLineLeft + 'px'
            }}
          ></View>
        </View>
      </ScrollView>
      {props.keepAlive ? (
        panels.map(panel => {
          return (
            <View
              key={panel.value}
              className={classNames(props.contentClassName, {
                [styles.hidden]: currentTab !== panel.value,
              })}
            >
              {panel.component}
            </View>
          )
        })
      ) : (
        <View className={classNames(props.contentClassName)}>
          {getCurrentPanel()}
        </View>
      )}
    </View>
  )
}

interface ITabPanelProps extends ViewProps {
  /**
   * Tab 索引
   */
  value: number | string
  /**
   * Tab 标题
   */
  title: string
}

export const TabPanel: React.FC<ITabPanelProps> = props => {
  return <View {...props}>{props.children}</View>
}
