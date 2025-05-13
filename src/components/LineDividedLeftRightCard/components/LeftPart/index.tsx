import { View } from '@tarojs/components';
import classNames from 'classnames';
import React, { CSSProperties } from 'react';

import styles from './index.module.scss';

interface Props {
  title: string;
  isSmaller?: boolean;
  className?: string;
  style?: string | CSSProperties;
  content?: string;
}

const LeftPart: React.FC<Props> = (props) => {
  const { className, style, title, content = '', isSmaller = true } = props;

  const contentClass = classNames({
    [styles.firstContent]: true,
    [styles.firstContentSmaller]: isSmaller
  });
  return (
    <View className={className ? className : styles.leftPart} style={style}>
      <View className={styles.firstTitle}>{title}</View>
      <View className={contentClass}>{content}</View>
    </View>
  );
};

export default LeftPart;
