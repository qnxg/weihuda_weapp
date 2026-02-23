import { ScrollView, Slot, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classNames from 'classnames'
import React, { useState, useImperativeHandle, forwardRef } from 'react'
import styles from './index.module.scss'
import type { BaseEventOrig, ScrollViewProps } from '@tarojs/components'

export interface Props {
  runFunc: (closer: () => void) => any
  topGap?: number
  leftGap?: number
  scrollViewProps?: ScrollViewProps
}

export interface RefProps {
  start: () => any
  stop: () => any
}

type IndexType = React.ForwardRefRenderFunction<
  RefProps,
  React.PropsWithChildren<Props>
>

const Index: IndexType = (props, ref) => {
  const { runFunc, topGap = 0 } = props
  const [refreshing, setRefreshing] = useState<boolean>(false)
  const [isToRefresh, setIsToRefresh] = useState<boolean>(false)

  const darkMode = Taro.getAppBaseInfo().theme === 'dark'

  const pullingRefresh = (e: BaseEventOrig) => {
    const d = e.detail.dy || 0
    if (d > 64) {
      setIsToRefresh(true)
    }
  }

  const stopRefresh = () => {
    Taro.nextTick(() => {
      setRefreshing(false)
      setIsToRefresh(false)
    })
  }

  const runRefresh = async () => {
    setRefreshing(true)
    await runFunc(stopRefresh)
  }

  useImperativeHandle(ref, () => ({
    start: runRefresh,
    stop: stopRefresh,
  }))

  return (
    <ScrollView
      {...props.scrollViewProps}
      scrollY
      enhanced
      enableFlex
      showScrollbar={false}
      refresherEnabled
      refresherThreshold={64}
      refresherBackground={darkMode ? '#000000' : '#fafafa'}
      refresherTriggered={refreshing}
      refresherDefaultStyle='none'
      onRefresherPulling={pullingRefresh}
      onRefresherRefresh={runRefresh}
      onRefresherRestore={stopRefresh}
      onRefresherAbort={stopRefresh}
      style={{
        height: topGap > 0 ? `calc(100vh - ${topGap}rpx)` : '100vh',
      }}
    >
      <Slot name='refresher'>
        <View className={styles.loadingOuter}>
          {refreshing ? (
            <View
              className={classNames({
                [styles.loading]: true,
                [styles.moveAnimate]: refreshing,
              })}
            />
          ) : (
            <View className={styles.tipText}>
              {isToRefresh ? '↑释放刷新' : '↓下拉刷新'}
            </View>
          )}
        </View>
      </Slot>
      {props.children}
    </ScrollView>
  )
}

const forwardIndex = forwardRef(Index)

export default forwardIndex
