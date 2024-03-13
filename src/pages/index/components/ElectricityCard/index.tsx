import React from 'react';
import { Block, Image, Text, View } from '@tarojs/components';
import icon from '@/static/index/icon/electricity.svg';
import empty from '@/static/empty/no-bind-room.svg';
import elecNumIcon from '@/static/icon/elec-num.svg';
import elecMoneyIcon from '@/static/icon/elec-money.svg';

import CardEmpty from '../CardEmpty';
import CardLayout from '../CardLayout';
import styles from './index.module.scss';

export interface Elec {
  balance: string;
  lightBalance: string;
  lightMoney: number;
  money: number | string;
  type: number;
}

export interface Dorm {
  garden: number;
  build: number;
  room: string;
}

interface ElectricCardProps {
  electricity?: Elec;
  dorm?: Dorm;
}

const ElectricityCard: React.FC<ElectricCardProps> = (props) => {
  const { electricity, dorm } = props;
  return (
    <CardLayout
      icon={icon}
      title='电费查询'
      moreUrl={dorm?.garden === 0 ? '/pages/roomBind/index' : '/queryPage/electricityHistory/index'}
      moreTitle={dorm?.garden === 0 ? '去绑定' : '历史记录'}
    >
      <Block>
        {electricity && electricity.money !== '未绑定' && electricity.lightBalance !== '' && (
          <View>
            <View className={styles.outer}>
              <Text className={`${styles.item} ${styles.left}`}>空调用电:</Text>
              <View className={`${styles.item} ${styles.mid}`}>
                <Image className={styles.img} src={elecMoneyIcon} />
                <Text>{(electricity && electricity.money) || 0}元</Text>
              </View>
              <View className={`${styles.item} ${styles.right}`}>
                <Image className={styles.img} src={elecNumIcon} />
                <Text>{(electricity && electricity.balance) || 0}度</Text>
              </View>
            </View>
            <View className={styles.outer}>
              <Text className={`${styles.item} ${styles.left}`}>其余用电:</Text>
              <View className={`${styles.item} ${styles.mid}`}>
                <Image className={styles.img} src={elecMoneyIcon} />
                <Text>{(electricity && electricity.lightMoney) || 0}元</Text>
              </View>
              <View className={`${styles.item} ${styles.right}`}>
                <Image className={styles.img} src={elecNumIcon} />
                <Text>{(electricity && electricity.lightBalance) || 0}度</Text>
              </View>
            </View>
          </View>
        )}
        {electricity && electricity.money !== '未绑定' && electricity.lightBalance === '' && (
          <View className={styles.outer}>
            <View className={styles.item}>
              <Image className={styles.img} src={elecMoneyIcon} />
              <Text>余额: {(electricity && electricity.money) || 0}元</Text>
            </View>
            <View className={styles.item}>
              <Image className={styles.img} src={elecNumIcon} />
              <Text>余电: {(electricity && electricity.balance) || 0}度</Text>
            </View>
          </View>
        )}
        {(!electricity || electricity.money === '未绑定') && (
          <CardEmpty icon={empty} text={dorm?.garden === 0 ? '快去绑定你的宿舍吧！' : '剩余电量查询失败'} />
        )}
      </Block>
    </CardLayout>
  );
};

export default ElectricityCard;
