import { Image, View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import React, { useCallback } from 'react';

import styles from './index.module.scss';

export interface CardLayoutProps {
  /** 卡片标题图标 */
  icon: string;
  /** 卡片标题 */
  title: string;
  /** 点击卡片需要跳转的页面地址 如`/pages/index/index`*/
  url?: string;
  /** 点击右上角需要跳转的页面地址 如`/pages/index/index`*/
  moreUrl?: string;
  /** 查看更多按钮的文案 */
  moreTitle?: string;
  /** 需要有子组件内容 */
  children?: JSX.Element;
}

const CardLayout: React.FC<CardLayoutProps> = (props) => {
  const navigate = useCallback(() => {
    if (props.url) {
      void Taro.navigateTo({ url: props.url });
    }
  }, [props.url]);

  return (
    <View className={styles.cardItem}>
      <View className={styles.outer} onClick={navigate}>
        <View className={styles.header}>
          <View className={styles.titlePart}>
            <Image className={styles.icon} src={props.icon} />
            <View className={styles.title}>{props.title}</View>
          </View>
          {props.moreUrl && (
            <View
              className={styles.moreTitle}
              onClick={() => {
                void Taro.navigateTo({ url: props.moreUrl || '/pages/index/index' });
              }}
            >
              {props.moreTitle || '查看更多'}
            </View>
          )}
        </View>
        {props.children}
      </View>
    </View>
  );
};

export default CardLayout;
