import { View, Image } from '@tarojs/components';
import React from 'react';

import styles from './index.module.scss';
import type { CSSProperties } from 'react';

interface Props {
  title: string;
  subTitle?: string | JSX.Element;
  icon?: string;
  className?: string;
  style?: string | CSSProperties;
  content?: string;
  subContent?: string;
  renderContent: JSX.Element;
}

const RightPart: React.FC<Props> = (props) => {
  const { className, style, title, subTitle = '', subContent = '' } = props;

  return (
    <View
      className={className ? className : styles.rightPart}
      style={Object.assign({}, style, { whiteSpace: 'normal' })}
    >
      <View className={styles.secondTitle}>
        <View className={styles.titleLeft}>{title}</View>
        <View className={styles.titleRight}>{subTitle}</View>
      </View>
      <View className={styles.secondContent}>
        {props.icon ? (
          <View className={styles.contentLeftIcon}>
            <Image className={styles.icon} src={props.icon} />
            <View className={styles.text}>{props.renderContent}</View>
          </View>
        ) : (
          <View className={styles.contentLeft}>{props.renderContent}</View>
        )}
        {subContent !== '' && <View className={styles.contentRight}>{subContent}</View>}
      </View>
    </View>
  );
};

export default RightPart;
