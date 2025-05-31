import { View, Image, Block } from '@tarojs/components';
import React from 'react';
import styles from './index.module.scss';
import LineDividedLeftRightCard from '@/components/LeftRightCard';
import LeftPart from '@/components/LeftRightCard/components/LeftPart';
import RightPart from '@/components/LeftRightCard/components/RightPart';
import iconNoK from '@/static/empty/no-exam.svg';
import location from '@/static/icon/location.svg';
import { onColors } from '@/utils/config';
import type { ExamArrange } from '@/apis/hdjw/examArrange';


interface Props {
  exam: ExamArrange[];
}

const Index: React.FC<Props> = (props) => {
  const { exam = [] } = props;
  if (exam.length !== 0) {
    return (
      <View>
        {exam.map((item, index) => {
          const start = item.startTime.split(' ');
          const end = item.endTime.split(' ');
          const day = start[0].replace(/-/g, '/');
          return (
            <LineDividedLeftRightCard
              key={`${item.name}${1000 - index}`}
              className={styles.cardOuter}
              lineColor={onColors[index % onColors.length]}
              renderLeft={<LeftPart title={day} content={`${start[1]}-${end[1]}`} />}
              renderRight={
                <RightPart
                  title={item.name}
                  subTitle={item.number}
                  renderContent={<Block>{`${item.classroom} 座位${item.seat}号`}</Block>}
                  icon={location}
                />
              }
            />
          );
        })}
      </View>
    );
  }

  return (
    <View className={styles.container}>
      <Image src={iconNoK} className={styles.iconNoJK} />
      <View className={styles.text}>暂时没有考试，好好学习吧</View>
    </View>
  );
};

export default Index;
