import { View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import Badge from '../Badge'
import Card from '../Card'
import style from './index.module.scss'
import type { Key, ReactNode } from 'react'

export type ReactNodeWithKey<K extends Key> = {
  node: ReactNode
  key: K
}

const CheckSortListItem: React.FC<{
  checkFlag: false | number
  content: ReactNode
  onClick: () => unknown
}> = props => {
  const isChecked = props.checkFlag !== false
  return (
    <Card
      onClick={props.onClick}
      className={style.card}
      needExtraPadding={false}
    >
      <View className={style.checkSortItemContainer}>
        <View className={style.checkSortItemNumberContainer}>
          {isChecked ? (
            <Badge
              content={props.checkFlag}
              size={Taro.pxTransform(38)}
              customClassName={style.checkSortItemNumber}
            />
          ) : (
            <></>
          )}
        </View>
        <View
          className={
            isChecked
              ? style.checkedSortListItemContentContainer
              : style.uncheckedSortListItemContentContainer
          }
        >
          {props.content}
        </View>
      </View>
    </Card>
  )
}

/**
 * 可选择/取消选择项目的排序列表
 *
 * 这是“受控组件”。列表项目和响应事件由调用方提供。
 *
 * checked和unchecked两个数组总共的所有key必须互不相同
 */
const CheckSortListDisplay = <K1 extends Key, K2 extends Key>(props: {
  /** 选中的项目列表 */
  checked: ReactNodeWithKey<K1>[]
  /** 未选中的项目列表 */
  unchecked: ReactNodeWithKey<K2>[]
  /** 点击了一个未选中项目的回调函数 */
  onCheck: (key: K2) => unknown
  /** 点击了一个已选中项目的回调函数 */
  onUncheck: (idx: K1) => unknown
}) => {
  return (
    <View className={style.checkSortListContainer}>
      {[
        ...props.checked.map((v, i) => (
          <CheckSortListItem
            checkFlag={i + 1}
            content={v.node}
            key={v.key}
            onClick={() => props.onUncheck(v.key)}
          />
        )),
        ...props.unchecked.map(v => (
          <CheckSortListItem
            checkFlag={false}
            content={v.node}
            key={v.key}
            onClick={() => props.onCheck(v.key)}
          />
        )),
      ]}
    </View>
  )
}

export default CheckSortListDisplay
