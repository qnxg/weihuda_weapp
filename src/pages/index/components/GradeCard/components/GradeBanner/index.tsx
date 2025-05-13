import { View } from '@tarojs/components';
import React from 'react';

import styles from './index.module.scss';

interface Grade {
  name: string;
  score: number;
}

interface Props {
  grade: Grade;
}

const GradeBanner: React.FC<Props> = ({ grade }) => {
  const { name = 'null', score = 0 } = grade;
  return (
    <View className={styles.outer}>
      <View className={styles.subject}>{name}</View>
      <View className={styles.banner}>
        <View className={styles.percent} style={{ width: `${score}%` }} />
      </View>
      <View className={styles.score}>{score}</View>
    </View>
  );
};

export default GradeBanner;
