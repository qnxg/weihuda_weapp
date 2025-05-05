import classNames from "classnames"
import { Text } from "@tarojs/components"
import { ReactNode } from "react"
import style from './index.module.scss'

const Badge: React.FC<{
    content: ReactNode,
    /** 注意行内样式无法被自动转换，考虑使用Taro.pxTransform */
    size: string | number,
    customClassName?: string
}> = (props) =>
        <Text
            className={classNames(style.badgeText, props.customClassName)}
            style={{
                height: props.size,
                minWidth: props.size
            }}
        >
            {props.content}
        </Text>

export default Badge