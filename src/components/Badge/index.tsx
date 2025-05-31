import { Text } from '@tarojs/components'
import classNames from 'classnames'
import style from './index.module.scss'
import type { ReactNode } from 'react'

/**
 * 带文字的徽章
 *
 * 和常见的带数字的“红点提示”比较相似。虽然目前的颜色是蓝色。
 */
const Badge: React.FC<{
  content: ReactNode
  /** 注意行内样式无法被自动转换，考虑使用Taro.pxTransform */
  size: string | number
  customClassName?: string
}> = props => (
  <Text
    className={classNames(style.badgeText, props.customClassName)}
    style={{
      height: props.size,
      minWidth: props.size,
    }}
  >
    {props.content}
  </Text>
)

export default Badge
