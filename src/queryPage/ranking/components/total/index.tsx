import React from 'react';
import { View } from '@tarojs/components';

import Score from './score';
import { Report } from '../../interface';
import styles from './index.module.scss';

interface Props {
  report: Report;
}

const Index: React.FC<Props> = ({ report }) => {
  return (
    <View className={styles.wrap}>
      <View className={styles.layout}>
        <View className={styles.chart}>
          <Score name='全部课程加权平均分' score={report.weightAvg} rank={report.weightAvgRank} />
          <Score name='全部课程算术平均分' score={report.arithmeticAvg} rank={report.arithmeticAvgRank} />
          <Score name='核心课程加权平均分' score={report.coreWeightAvg} rank={report.coreWeightAvgRank} />
          <Score name='核心课程算术平均分' score={report.coreArithmeticAvg} rank={report.coreArithmeticAvgRank} />
        </View>
        <View className={styles.tips}>
          平均学分绩点：{report.GPA} 平均学分绩点排名：{report.GPARank}
        </View>
      </View>
      <View className={styles.position} />
    </View>
  );
};

export default Index;
