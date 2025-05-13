import { View, Image, Text } from '@tarojs/components';
import classnames from 'classnames';
import React, { useState } from 'react';
import styles from './index.module.scss';
import DisplayCard from '@/components/DisplayCard';
import iconNo from '@/static/empty/no-room.svg';
import iconFilter from '@/static/emptyRoom/icon-filter.svg';
import type { EmptyRoom } from '../../interface';


interface Props {
  roomList: EmptyRoom[];
  run: () => unknown;
  highlight: EmptyRoom;
  setHighlight: any;
}

const ResultArea: React.FC<Props> = (props) => {
  const { roomList, run, highlight, setHighlight } = props;
  /**用户点击搜索按钮的记录 */
  const [searched, setSearched] = useState<boolean>(false);

  /** 处理点击教室 */
  const onClickCell = (item: EmptyRoom): void => {
    if (item.name !== highlight.name) {
      setHighlight(item);
    }
  };

  return (
    <View className={styles.container}>
      <View
        className={styles.search}
        onClick={(): void => {
          run();
          setSearched(true);
        }}
      >
        搜索
      </View>
      <View className={styles.tips}>
        <View>空教室所查数据均来自教务系统，仅供参考</View>
        <View>请以实际情况为准</View>
      </View>
      {searched && roomList.length > 0 && (
        <View>
          <View className={styles.itemContainer}>
            <View className={styles.head}>
              <Image src={iconFilter} className={styles.preIcon} />
              <View className={styles.titles}>查询结果</View>
            </View>
            <View className={styles.Box}>
              {roomList.map((item) => (
                <View
                  className={classnames({
                    [styles.highlight]: item.name === highlight.name,
                    [styles.item]: item.name !== highlight.name
                  })}
                  key={item.name}
                  onClick={(): void => onClickCell(item)}
                >
                  {item.name}
                </View>
              ))}
            </View>
          </View>
          <View className={styles.itemContainer}>
            <View className={styles.head}>
              <Image src={iconFilter} className={styles.preIcon} />
              <View className={styles.titles}>教室详情</View>
            </View>
            <DisplayCard>
              <View>教室类型：{highlight.type}</View>
              <View>教室座位数：{highlight.seat}</View>
              <View>教室考试座位数：{highlight.examSeat}</View>
            </DisplayCard>
          </View>
        </View>
      )}
      {searched && roomList.length === 0 && (
        <View className={styles.itemContainer}>
          <View className={styles.head}>
            <Image src={iconFilter} className={styles.preIcon} />
            <View className={styles.titles}>查询结果</View>
          </View>
          <Image src={iconNo} className={styles.noRoom} />
          <Text className={styles.noAlt}>解锁成就 : 没有空教室</Text>
        </View>
      )}
    </View>
  );
};

export default ResultArea;
