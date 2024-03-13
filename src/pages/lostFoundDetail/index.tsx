import { useState, useEffect } from 'react';
import { View, Image } from '@tarojs/components';
import styles from './index.module.scss';
import { dateFormat } from '@/utils/tool';
import Taro from '@tarojs/taro';
import { LostAndFoundArticle } from '@/information/components/LostFoundCard';

const Index: React.FC = () => {
  const [data, setData] = useState<LostAndFoundArticle>({});
  // 页面通信，获取data
  const pages = Taro.getCurrentPages();
  const currPage = pages[pages.length - 1];
  const channel = currPage.getOpenerEventChannel();

  channel.on('articleData', (res) => {
    setData(res.data);
  });

  return (
    data.name && (
      <View className={styles.container}>
        <View className={styles.titleContainer}>
          <View className={styles.title}>{(data.type === 'found' ? '寻物 | ' : '招领 | ') + data.name}</View>
          <View className={styles.extra}>
            {data.contact !== '' && <View>联系方式：{data.contact}</View>}

            <View style={{ marginTop: '4px' }}>发帖日期：{dateFormat(+data.createTime).ymd}</View>
            <View style={{ marginTop: '4px' }}>
              {(data.type === 'found' ? '失物地点：' : '捡物地点：') + data.place}
            </View>
          </View>
        </View>
        <View className={styles.contentContainer}>
          <View className={styles.content}>
            {data.desc}
            <View style={{ marginTop: '8px' }}>
              {data.images.length !== 0 &&
                data.images.map((v, i) => {
                  return (
                    <View key={i}>
                      <Image src={v.url} style='width: 100%;' />
                    </View>
                  );
                })}
            </View>
          </View>
        </View>
      </View>
    )
  );
};

export default Index;
