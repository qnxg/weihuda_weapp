import React, { useMemo } from 'react';
import { View } from '@tarojs/components';
import icon from '@/static/index/icon/days-left.svg';

import CardLayout from '../CardLayout';
import styles from './index.module.scss';

interface Props {
  daysLeft: number;
}

const CountdownCard: React.FC<Props> = ({ daysLeft }) => {
  const dataList = useMemo(() => {
    const temp = Math.abs(daysLeft || 0)
      .toString()
      .split('');
    const result = ['0', '0', '0'];
    result.splice(3 - temp.length < 0 ? 0 : 3 - temp.length, temp.length, ...temp);
    return result;
  }, [daysLeft]);
  return (
    <CardLayout icon={icon} title={daysLeft > 0 ? '假期倒计时' : '开学倒计时'} url='/queryPage/schoolCalendar/index'>
      <View className={styles.outer}>
        <View>距离{daysLeft > 0 ? '本学期' : '假期'}结束还有</View>
        <View className={styles.numArray}>
          {dataList.map((item, index) => {
            return (
              <View key={1000 - index} className={styles.num}>
                {item}
              </View>
            );
          })}
        </View>
        <View>天</View>
      </View>
    </CardLayout>
  );
};

export default CountdownCard;
