import React, { ReactNode } from 'react'
import { View, Image } from '@tarojs/components'

import styles from './index.module.scss'

interface Props extends React.PropsWithChildren<{}> {
  title?: string
  subTitle?: string | null
  footer?: string | ReactNode
  icon?: string
}

const DisplayCard: React.FC<Props> = (props) => {
  return (
    <View className={styles.container}>
      <View className={styles.wrapper}>
        <View className={styles.titleContainer}>
          <View className={styles.title}>
            <View>{props.icon && <Image src={props.icon} mode='heightFix' className={styles.titleImg} />}</View>
            <View>{props.title}</View>
          </View>
          <View className={styles.subTitle}>{props.subTitle}</View>
        </View>
        <View className={styles.content}>{props.children}</View>
        <View className={styles.footer}>{props.footer}</View>
      </View>
    </View>
  )
}

export default DisplayCard
