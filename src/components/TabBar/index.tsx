import { View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classNames from 'classnames'
import React, { useCallback, useRef } from 'react'

import styles from './index.module.scss'

/**
 * @interface Props
 * items 选项数组
 * current 选中索引
 * num 解决双重tab问题
 * onClick 点击函数
 */
interface Props {
  items: Array<string | number>
  current: number | null
  num: number
  onClick: (indexOfTabClicked: number) => void
  className?: string
}

const TabBar: React.FC<Props> = props => {
  const { items, current, num, onClick } = props
  const preIndexRef = useRef<number | null>(0)
  const clickFunc = useCallback(
    (index: number) => () => {
      onClick(index)
      if (preIndexRef.current === index) {
        void Taro.pageScrollTo({
          scrollTop: 0,
          duration: 400,
        })
      }
      preIndexRef.current = index
    },
    [onClick]
  )
  return (
    <View className={classNames(styles.tabWarp, props.className)}>
      <View className={styles.container} style={`top: ${num * 64}rpx`}>
        {items.map((item, index) => {
          const cx = classNames({
            [styles.item]: true,
            [styles.select]: index === current,
          })
          return (
            <View key={item} className={cx} onClick={clickFunc(index)}>
              {item}
            </View>
          )
        })}
      </View>
    </View>
  )
}

export default TabBar
