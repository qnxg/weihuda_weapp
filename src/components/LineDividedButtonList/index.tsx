import { Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import React from 'react'
import LineDividedList from '../LineDividedList'
import arrow from '@/static/mine/arrow.svg'
import type { ITouchEvent } from '@tarojs/components'
import type { ReactNode } from 'react'

interface LineDividedButtonListProps {
  items: {
    /** 按钮标题 */
    title: ReactNode
    /** 按钮图标 */
    icon?: ReactNode
    /** 点击事件 */
    onClick?: (event: ITouchEvent) => void
  }[]
}

/**
 * 用分割线纵向组织的长按钮的列表，按钮尾部有“>”的导航符号。
 */
export const LineDividedButtonList: React.FC<LineDividedButtonListProps> = ({
  items,
}) => {
  return (
    <LineDividedList
      items={items.map(node => ({
        content: (
          <>
            {node.title}
            <Image
              src={arrow}
              style={{
                width: Taro.pxTransform(18),
                height: Taro.pxTransform(30),
              }}
            />
          </>
        ),
        icon: node.icon,
        onClick: node.onClick,
      }))}
    />
  )
}
