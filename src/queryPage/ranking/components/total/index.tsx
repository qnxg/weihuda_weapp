import { View } from '@tarojs/components';
import React from 'react';

import styles from './index.module.scss';
import Score from './score';
import type { Report } from '../../interface';

interface Props {
  report: Report;
  must: string[] | null;
  year: number;
  show: boolean;
}

const Index: React.FC<Props> = ({ report, must, year, show }) => {
  return (
    <View className={styles.wrap}>
      <View className={styles.layout}>
        <View className={styles.chart}>
          <Score name='全部课程加权平均分' score={report.weightAvg} rank={report.weightAvgRank} />
          <Score name='全部课程算术平均分' score={report.arithmeticAvg} rank={report.arithmeticAvgRank} />
          <Score name='核心课程加权平均分' score={report.coreWeightAvg} rank={report.coreWeightAvgRank} />
          <Score name='核心课程算术平均分' score={report.coreArithmeticAvg} rank={report.coreArithmeticAvgRank} />
        </View>
        {must && show ?
          <View className={styles.must}>
            {year}学年全部必修课程加权平均分：{must[0]} / {must[1]}门课程
          </View> : null
        }
        <View className={styles.tips}>
          平均学分绩点：{report.GPA} 平均学分绩点排名：{report.GPARank}
        </View>
      </View>
      <View className={styles.position} />
    </View>
  );
};

export default Index;
