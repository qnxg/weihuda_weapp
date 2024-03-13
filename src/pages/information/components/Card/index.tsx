import { ZhihuItem } from '@/apis/zhihu';
import { Image, Navigator, Text, View } from '@tarojs/components';
import React from 'react';
import styles from './index.module.scss';

interface Props {
  item: ZhihuItem;
}

const Card: React.FC<Props> = (props) => {
  const { id, title, address, date_begin: date, image } = props.item;
  return (
    <Navigator url={`/pages/detail/index?id=${id}&title=${title}&address=${address}&date=${date}`}>
      <View className={styles.container}>
        <View className={styles.infoContainer}>
          <View className={styles.title}>{title}</View>
          {(address.length !== 0 || date.length !== 0) && (
            <View className={styles.extra}>
              {address.length !== 0 ? (
                <View className={styles.addressContainer}>
                  <View className={styles.address} />
                  <Text>{address}</Text>
                </View>
              ) : null}
              {date.length !== 0 ? (
                <View>
                  <View className={styles.date} />
                  <Text>{date}</Text>
                </View>
              ) : null}
            </View>
          )}
        </View>
        {image.length !== 0 ? (
          <View className={styles.imgContainer}>
            <Image src={image} style='width: 100%; height: 100%;' />
          </View>
        ) : null}
      </View>
    </Navigator>
  );
};

export default Card;
