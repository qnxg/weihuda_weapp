import { View } from "@tarojs/components";
import React from "react";
import styles from './index.module.scss'
import CardProps from "../CardProps";

const CardListSort = (props: {
    childrenList: React.FC<CardProps>[],
    onEachLoadingStatusChange: (isLoading: boolean) => any,
    reloadAllController: unknown
}) => {
    return <>{props.childrenList.map(
        (Card, idx) =>
            <Card
                key={idx}
                onLoadingStatusChange={props.onEachLoadingStatusChange}
                reloadController={props.reloadAllController}
            />
    )}</>
};

export default CardListSort;