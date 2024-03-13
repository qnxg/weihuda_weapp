import React from 'react';
import { CommonEventFunction } from '@tarojs/components/types/common';
import { View, Text, Picker, Image } from '@tarojs/components';
import iconFinger from '@/static/emptyRoom/icon-finger.svg';
import { useSelector } from 'react-redux';

import styles from './index.module.scss';
import { GlobalStore } from '../../../../../types/global-store';

interface Props {
  currentSem: number;
  setSemester: any;
  run: any;
}

const PickerArea: React.FC<Props> = (props) => {
  const { currentSem, setSemester, run } = props;
  const { semesters } = useSelector((state: GlobalStore) => state.classTable);
  /**
   * picker的值发生改变
   * @param e
   */
  const pickerChange: CommonEventFunction = (e): void => {
    setSemester(e.detail.value);
    run();
  };

  return (
    <View className={styles.container}>
      <View>
        <Picker
          mode='selector'
          range={semesters}
          value={currentSem}
          onChange={pickerChange}
          className={styles.picker}
          rangeKey='show'
        >
          <Image src={iconFinger} className={styles.preIcon} />
          <View className={styles.titles}>选择学年、学期</View>
          <Text decode className={styles.pickerText}>
            {semesters[currentSem].show}
          </Text>
        </Picker>
      </View>
    </View>
  );
};

export default PickerArea;
