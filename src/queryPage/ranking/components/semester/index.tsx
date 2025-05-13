import { View, Text, ScrollView } from '@tarojs/components';
import React from 'react';

import { Semester } from '../../interface';
import style from './index.module.scss';

interface Props {
  semseter: Semester[];
}

const Index: React.FC<Props> = ({ semseter }) => {
  return (
    <View className={style.layout}>
      {semseter.map((semesterItem) => {
        return (
          <View key={semesterItem.year}>
            <Text className={style.title}>{semesterItem.year}</Text>
            <ScrollView scrollX className={style.scroll}>
              {semesterItem.items.map((item) => {
                return (
                  <View className={style.content} key={semesterItem + item.name}>
                    <Text className={style.itemTitle}>{item.name}</Text>
                    <View className={style.all}>
                      <View className={style.details}>全部课程加权平均分：{item.weightAvg}</View>
                      <View className={style.details}>全部课程加权排名：{item.weightAvgRank}</View>
                    </View>
                    <View className={style.core}>
                      <View className={style.details}>全部核心课程加权平均分：{item.coreWeightAvg}</View>
                      <View className={style.details}>全部核心课程加权排名：{item.coreWeightAvgRank}</View>
                    </View>
                    <View className={style.tips}>
                      平均学分绩点：{item.GPA} 平均学分绩点排名：{item.GPARank}
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        );
      })}
    </View>
  );
};

export default Index;
