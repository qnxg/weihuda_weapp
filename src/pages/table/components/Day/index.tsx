import React from 'react';
import classNames from 'classnames';
import { View } from '@tarojs/components';
import { useDispatch } from 'react-redux';

import { FormatTable } from '../../interface';
import styles from './index.module.scss';

/**
 * @interface Day Component Props
 * dayCourse 当天的课程数组
 */
interface Props {
  /** 当天的课程数组 */
  dayCourse: Array<Array<FormatTable>>;
}

const Day: React.FC<Props> = (props) => {
  const { dayCourse = [] } = props;
  const dispatch = useDispatch();
  /**
   * 显示课程的详细信息
   * @param e 当前点击的课程数组
   */
  const onShowFloat = (e: Array<FormatTable>): void => {
    dispatch({
      type: 'classTable/save',
      payload: {
        showFloat: true,
        floatData: e
      }
    });
  };

  return (
    <View className={styles.day}>
      {dayCourse.map((item, index) => {
        const cx = classNames({
          [styles.course]: true,
          [styles.mults]: item.length > 1
        });
        const isOdd = item.length >= 1 && item[0].show;
        return isOdd && item[0].JCFrom && item[0].len ? (
          <View
            onClick={(): void => onShowFloat(item)}
            key={String(index)}
            className={cx}
            style={`margin-top: ${(item[0].JCFrom - 1) * 95 + 5}rpx; background: ${item[0].bgColor}; height: ${
              item[0].len * 95 - 10
            }rpx`}
          >
            <View className={styles['course-title']}>{item[0].classname}</View>
            <View className={styles['course-location']}>@{item[0].location}</View>
          </View>
        ) : null;
      })}
    </View>
  );
};

export default Day;
