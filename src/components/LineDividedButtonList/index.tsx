import { Image, ITouchEvent, View } from '@tarojs/components';
import React, { ReactNode } from 'react';
import style from './index.module.scss'
import arrow from '@/static/mine/arrow.svg'

interface LineDividedListProps {
    items: {
        title: ReactNode
        icon?: ReactNode
        onClick?: (event: ITouchEvent) => void
    }[];
}

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