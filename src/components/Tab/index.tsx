import { View } from '@tarojs/components'
import classNames from 'classnames'
import React, { useCallback, useRef, Fragment } from 'react'
import Panel from './components/Panel'
import styles from './index.module.scss'
import type { ITouchEvent } from '@tarojs/components/types/common'
import type { ReactNode } from 'react'

const MIN_DISTANCE = 100
const MAX_INTERVAL = 10

interface TabItem {
  key: string | number
  label: ReactNode
  body: ReactNode
}

interface Props {
  items: TabItem[]
  onChange: (n: number, e?: ITouchEvent) => void
  current: number | null
  swipeable?: boolean
}

const Index: React.FC<Props> = props => {
  const { current, onChange, swipeable = true, items } = props

  const isCurrentNull = current === null

  if (isCurrentNull && items.length != 0) {
    throw new Error('Tab组件items非空，然而当前选项卡序号未设置')
  }

  // 一些滑动需要的 ref
  const _touchDot = useRef<number>(0)
  const _timer = useRef<NodeJS.Timeout>()
  const _interval = useRef<number>(0)
  const _isMoving = useRef(false)

  const handleTouchStart = useCallback(
    (e: ITouchEvent) => {
      if (!swipeable || isCurrentNull) {
        return
      }
      // 获取触摸时的原点
      _touchDot.current = e.touches[0]!.pageX
      // 使用js计时器记录时间
      _timer.current = setInterval(() => {
        _interval.current++
      }, 100)
    },
    [swipeable, isCurrentNull]
  )

  const handleTouchMove = useCallback(
    (e: ITouchEvent) => {
      if (!swipeable || isCurrentNull) {
        return
      }
      const touchMove = e.touches[0]!.pageX
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
          onChange(current + 1, e)
        } else if (current - 1 >= 0 && moveDistance >= MIN_DISTANCE) {
          // 向右滑动
          _isMoving.current = true
          onChange(current - 1, e)
        }
      }
    },
    [onChange, current, items.length, swipeable, isCurrentNull]
  )

  const handleTouchEnd = useCallback(() => {
    if (!swipeable || isCurrentNull) {
      return
    }
    clearInterval(_timer.current as NodeJS.Timeout)
    _interval.current = 0
    _isMoving.current = false
  }, [swipeable, isCurrentNull])

  // 底部小滑块左边的宽度
  // 如果每一个tab里的文字长度一样，则可以设置成 100 / items.length * current
  // const tabsLeftPersentage = [0, 17.8, 36, 54, 77];

  return (
    <Fragment>
      <View className={styles.tabWarp}>
        <View className={styles.container}>
          {items.map((item, index) => (
            <View
              key={item.key}
              className={classNames({
                [styles.item]: true,
                [styles.select]: index === current,
              })}
              onClick={(): void => onChange(index)}
            >
              {item.label}
            </View>
          ))}
          {current !== null ? (
            <View
              className={styles.line}
              style={{
                // 如果每一个tab里的文字长度一样，则可以设置成 100 / items.length * current
                // 否则手动设置为 ${tabsLeftPersentage[current]}
                left: `${(100 / items.length) * current}%`,
                marginLeft: `${50 / items.length - 2.666}%`,
              }}
            />
          ) : (
            <></>
          )}
        </View>
      </View>
      {current !== null ? (
        <View
          className={styles.mainContainer}
          style={{ transform: `translate3d(${current * -100}%, 0, 1px)` }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {props.items.map((item, idx) => (
            <Panel key={`panel-${item.key}`} current={current} index={idx}>
              {item.body}
            </Panel>
          ))}
        </View>
      ) : (
        <></>
      )}
    </Fragment>
  )
}

export default Index
