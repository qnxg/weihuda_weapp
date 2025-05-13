import { View, Text, Picker, Image, Input } from '@tarojs/components';
import { CommonEventFunction } from '@tarojs/components/types/common';
import React from 'react';
import styles from './index.module.scss';
import iconFinger from '@/static/emptyRoom/icon-finger.svg';

import { useAppSelector } from '@/utils/hooks/redux';

interface Props {
  currentSem: number;
  setSemester: any;
  setKeyword: any;
}

const PickerArea: React.FC<Props> = (props) => {
  const { currentSem, setSemester, setKeyword } = props;
  const { semesters } = useAppSelector((state) => state.classTable);
  /**
   * picker的值发生改变
   * @param e
   */
  const pickerChange: CommonEventFunction = (e): void => {
    setSemester(e.detail.value);
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
      <View className={styles.inputArea}>
        <Image src={iconFinger} className={styles.preIcon} />
        <View className={styles.titles}>输入课程名称或课程编号</View>
        <Input
          className={styles.input}
          type='text'
          // placeholderStyle='color:#cccccc'
          placeholder='课程名称或编号，支持模糊搜索'
          onInput={(e): void => {
            setKeyword(e.detail.value);
          }}
        />
      </View>
    </View>
  );
};

export default PickerArea;
