import { View, ViewProps } from '@tarojs/components'
import classNames from 'classnames'
import React, { ReactNode, useState } from 'react'
import styles from './index.module.scss'

interface ITabsProps extends ViewProps {
  current?: number
  onChange?: (index: number) => void
}

interface IPanelData {
  value: number
  title: string
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
export const Tabs: React.FC<ITabsProps> = (props) => {
  // 获取所有的 TabPanel 组件
  const panels: IPanelData[] = (props.children! as ReactNode[]).map((child: any) => {
    return {
      value: child.props.value,
      title: child.props.title,
      component: child
    }
  })

  // 当前选中的 Tab
  const [currentTab, setCurrentTab] = useState(props.current !== undefined ? props.current : panels[0].value)

  const getCurrentPanel = () => {
    return panels.find((panel) => panel.value === currentTab)!.component
  }

  return (
    <View>
      <View className={styles.tabs}>
        {panels.map((panel) => (
          <View
            key={panel.value}
            className={classNames(styles.tabItem, {
              [styles.active]: currentTab === panel.value
            })}
            onClick={() => {
              setCurrentTab(panel.value)
              if (props.onChange) {
                props.onChange(panel.value)
              }
            }}
          >
            {panel.title}
          </View>
        ))}
      </View>
      <View className={styles.tabContent}>{getCurrentPanel()}</View>
    </View>
  )
}

interface ITabPanelProps extends ViewProps {
  value: number
  title: string
}

export const TabPanel: React.FC<ITabPanelProps> = (props) => {
  return <View {...props}>{props.children}</View>
}
