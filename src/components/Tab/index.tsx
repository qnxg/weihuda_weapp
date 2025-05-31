import { View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classNames from 'classnames'
import React, { useCallback, useRef, Fragment } from 'react'

import styles from './index.module.scss'
import type { ITouchEvent } from '@tarojs/components/types/common'

const MIN_DISTANCE = 100
const MAX_INTERVAL = 10

interface Props {
  children: React.ReactNode
  onChange: (n: number, e?: ITouchEvent) => void
  current: number
  items: any[]
  swipeable?: boolean
}

const Index: React.FC<Props> = props => {
  const { current, onChange, items = [], swipeable = true } = props

  // 一些滑动需要的 ref
  const _touchDot = useRef<number>(0)
  const _timer = useRef<NodeJS.Timeout>()
  const _interval = useRef<number>(0)
  const _isMoving = useRef(false)

  const preIndexRef = useRef<number | null>(0)

  const changeItem = useCallback(
    (index: number, e?: ITouchEvent) => {
      onChange(index, e)
      if (preIndexRef.current === index) {
        void Taro.pageScrollTo({
          scrollTop: 0,
          duration: 400,
        })
      }
      preIndexRef.current = index
    },
    [onChange]
  )

  const handleTouchStart = useCallback(
    (e: ITouchEvent) => {
      if (!swipeable) {
        return
      }
      // 获取触摸时的原点
      _touchDot.current = e.touches[0].pageX
      // 使用js计时器记录时间
      _timer.current = setInterval(() => {
        _interval.current++
      }, 100)
    },
    [swipeable]
  )

  const handleTouchMove = useCallback(
    (e: ITouchEvent) => {
      if (!swipeable) {
        return
      }
      const touchMove = e.touches[0].pageX
      const moveDistance = touchMove - _touchDot.current
      const maxIndex = items.length

      if (
        !_isMoving.current &&
        _interval.current < MAX_INTERVAL &&
        _touchDot.current > 20
      ) {
        if (current + 1 < maxIndex && moveDistance <= -MIN_DISTANCE) {
          // 向左滑动
          _isMoving.current = true
          changeItem(current + 1, e)
        } else if (current - 1 >= 0 && moveDistance >= MIN_DISTANCE) {
          // 向右滑动
          _isMoving.current = true
          changeItem(current - 1, e)
        }
      }
    },
    [changeItem, current, items.length, swipeable]
  )

  const handleTouchEnd = useCallback(() => {
    if (!swipeable) {
      return
    }
    clearInterval(_timer.current as NodeJS.Timeout)
    _interval.current = 0
    _isMoving.current = false
  }, [swipeable])

  // 底部小滑块左边的宽度
  // 如果每一个tab里的文字长度一样，则可以设置成 100 / items.length * current
  // const tabsLeftPersentage = [0, 17.8, 36, 54, 77];

  return (
    <Fragment>
      <View className={styles.tabWarp}>
        <View className={styles.container}>
          {items.map((item, index) => {
            const cx = classNames({
              [styles.item]: true,
              [styles.select]: index === current,
            })
            return (
              <View
                key={item}
                className={cx}
                onClick={(): void => changeItem(index)}
              >
                {item}
              </View>
            )
          })}
          <View
            className={styles.line}
            style={{
              // 如果每一个tab里的文字长度一样，则可以设置成 100 / items.length * current
              // 否则手动设置为 ${tabsLeftPersentage[current]}
              left: `${(100 / items.length) * current}%`,
              marginLeft: `${50 / items.length - 2.666}%`,
            }}
          />
        </View>
      </View>
      <View
        className={styles.mainContainer}
        style={{ transform: `translate3d(${current * -100}%, 0, 1px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {props.children}
      </View>
    </Fragment>
  )
}

export default Index
