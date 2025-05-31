import { View } from '@tarojs/components'
import React from 'react'
import style from './index.module.scss'
import type { ITouchEvent } from '@tarojs/components'
import type { ReactNode } from 'react'

interface LineDividedItem {
  /** 项目内容 */
  content: ReactNode
  /** 项目图标 */
  icon?: ReactNode
  /** 点击事件 */
  onClick?: (event: ITouchEvent) => void
}

interface LineDividedListProps<T extends LineDividedItem> {
  items: T[]
}

const LineDividedList = (<T extends LineDividedItem>({
  items,
}: LineDividedListProps<T>) => {
  const res: ReactNode[] = []
  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    res.push(
      <View className={style.item} onClick={item.onClick}>
        <View className={style.imgContainer}>{item.icon ?? <></>}</View>
        <View className={style.titleContainer}>{item.content}</View>
      </View>
    )
    if (i != items.length - 1) {
      res.push(<View className={style.divider} />)
    }
  }
  return <View className={style.list}>{res}</View>
}) satisfies React.FC

export default LineDividedList
