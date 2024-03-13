import React from 'react';
import { CommonEventFunction } from '@tarojs/components/types/common';
import { View, Text, Picker, Radio, Image } from '@tarojs/components';
import iconFinger from '@/static/emptyRoom/icon-finger.svg';

import { multiArray } from '@/utils/config';
import { Radio as IRadio } from '../../interface';
import styles from './index.module.scss';

interface Props {
  pickerValue: number[];
  radioValue: IRadio[];
  setState: any;
}

const PickerArea: React.FC<Props> = (props) => {
  const { pickerValue = [], radioValue = [], setState } = props;
  /**
   * picker的值发生改变
   * @param e
   */
  const pickerChange: CommonEventFunction = (e): void => {
    setState((s) => ({
      ...s,
      pickerValue: e.detail.value
    }));
  };

  /**
   * radio选择事件处理
   * @param e
   */
  const radioChange = (e: number): void => {
    const temp: Array<IRadio> = Object.assign([], radioValue);
    temp[e].checked = !temp[e].checked;
    setState((s) => ({
      ...s,
      radioValue: temp
    }));
  };

  /**
   * 渲染radio
   */
  const radioArea = radioValue.map((item, index) => {
    return (
      <View className={styles.radioItem} key={item.id} onClick={(): void => radioChange(index)}>
        <View className={styles.radioLeft}>
          <Radio color='#328ccb' value={item.id} checked={item.checked} className={styles.radios} />
          <Text>{item.text[0]}</Text>
        </View>
        <View>{item.text[1]}</View>
      </View>
    );
  });

  return (
    <View className={styles.container}>
      <View>
        <Picker
          mode='multiSelector'
          range={multiArray}
          value={pickerValue}
          onChange={pickerChange}
          className={styles.picker}
        >
          <Image src={iconFinger} className={styles.preIcon} />
          <View className={styles.titles}>选择楼栋、周数、星期</View>
          <Text decode className={styles.pickerText}>
            {`${multiArray[0][pickerValue[0]]}  ${multiArray[1][pickerValue[1]]}  ${multiArray[2][pickerValue[2]]}`}
          </Text>
        </Picker>
      </View>
      <View>
        <View className={styles.radioArea}>
          <Image src={iconFinger} className={styles.preIcon} />
          <View className={styles.titles}>选择课时</View>
          <View className={styles.radioBox}>{radioArea}</View>
        </View>
      </View>
    </View>
  );
};

export default PickerArea;
