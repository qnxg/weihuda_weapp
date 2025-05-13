import { Image, ITouchEvent, View } from '@tarojs/components';
import React, { ReactNode } from 'react';
import style from './index.module.scss'
import arrow from '@/static/mine/arrow.svg'

interface LineDividedListProps {
    items: {
        /** 按钮内容 */
        title: ReactNode
        /** 按钮图标 */
        icon?: ReactNode
        /** 点击事件 */
        onClick?: (event: ITouchEvent) => void
    }[];
}

/**
 * 用分割线纵向组织的长按钮的列表，按钮尾部有“>”的导航符号。
 */
export const LineDividedButtonList: React.FC<LineDividedListProps> = ({ items }) => {
    const res: ReactNode[] = [];
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        res.push(
            <View className={style.item} onClick={item.onClick}>
                <View className={style.imgContainer}>
                    {item.icon ?? <></>}
                </View>
                <View className={style.titleContainer}>
                    {item.title}
                    <Image src={arrow} className={style.arrow} />
                </View>
            </View>
        )
        if (i != items.length - 1) {
            res.push(<View className={style.divider} />)
        }
    }
    return <View className={style.list}>{res}</View>;
};