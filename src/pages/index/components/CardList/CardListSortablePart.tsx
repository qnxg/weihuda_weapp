import { View } from "@tarojs/components";
import React from "react";
import styles from './index.module.scss'

const CardListSortablePart: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <>
            {React.Children.map(children, (child, index) => (
                // <View className={styles.cardItem} key={index}>
                <>
                    {child}
                </>
                // </View>
            ))}
        </>
    );
};

export default CardListSortablePart;