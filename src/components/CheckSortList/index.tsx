import { View } from "@tarojs/components"
import Taro from "@tarojs/taro"
import { Key, ReactNode } from "react"
import Card from "../Card"
import style from './index.module.scss'
import Badge from "../Badge"

export type ReactNodeWithKey<K extends Key> = {
    node: ReactNode,
    key: K
}

const CheckSortListItem: React.FC<{
    checkFlag: false | number,
    content: ReactNode,
    onClick: () => unknown
}> = (props) => {
    const isChecked = props.checkFlag !== false;
    return <Card onClick={props.onClick} className={style.card} needExtraPadding={false}>
        <View className={style.checkSortItemContainer}>
            <View className={style.checkSortItemNumberContainer}>
                {
                    isChecked ?
                        <Badge
                            content={props.checkFlag}
                            size={Taro.pxTransform(38)}
                            customClassName={style.checkSortItemNumber}
                        />
                        : <></>
                }
            </View>
            <View
                className={
                    isChecked ? style.checkedSortListItemContentContainer :
                        style.uncheckedSortListItemContentContainer
                }
            >
                {props.content}
            </View>
        </View>
    </Card>
}

/** 
 * 这是受控组件
 * 
 * checked和unchecked两个数组总共的所有key必须互不相同
 */
export const CheckSortListDisplay = <K1 extends Key, K2 extends Key>(props: {
    checked: ReactNodeWithKey<K1>[],
    unchecked: ReactNodeWithKey<K2>[],
    onCheck: (key: K2) => unknown,
    onUncheck: (idx: K1) => unknown,
}) => {
    return <View className={style.checkSortListContainer}>
        {[
            ...props.checked.map(
                (v, i) =>
                    <CheckSortListItem
                        checkFlag={i + 1}
                        content={v.node}
                        key={v.key}
                        onClick={() => props.onUncheck(v.key)}
                    />
            ),
            ...props.unchecked.map(
                (v) =>
                    <CheckSortListItem
                        checkFlag={false}
                        content={v.node}
                        key={v.key}
                        onClick={() => props.onCheck(v.key)}
                    />
            )
        ]}
    </View>
}

export default CheckSortListDisplay