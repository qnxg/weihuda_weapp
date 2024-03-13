import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import { dateFormat } from '@/utils/tool';
import styles from './index.module.scss';
import Taro from '@tarojs/taro';

// 失物招领数据类型
/**
 * lostAndFoundArticle
 */
export interface LostAndFoundArticle {
  /**
   * 校园卡号，如果捡到校园卡可以填写捡到的校园卡号
   */
  card_num: string;
  /**
   * 联系方式，发帖者的联系方式
   */
  contact: string;
  /**
   * 发帖时间，unix时间戳
   */
  createTime: string | number;
  /**
   * 描述，描述信息
   */
  desc: string;
  /**
   * 帖子id，帖子在数据库中的唯一id，可以让数据库自动生成（建议用简单的递增的数字作为id）
   */
  id?: number;
  /**
   * 图片数量，发帖者上传的图片数量
   */
  image_count: number;
  /**
   * 图片地址，发帖者上传的图片地址
   */
  images: ImageItem[];
  /**
   * 物品名称，丢失或寻找的物品名称
   */
  name: string;
  /**
   * 发布状态，三种取值，0 审核中，1 审核通过，2 审核未通过
   */
  status: number;
  /**
   * 学号，发帖者学号
   */
  stu_id: string;
  /**
   * 帖子类型，只有两种取值：lost，found；寻物帖或者招领帖的意思
   */
  type: string;
  /**
   * 失误/捡物地点
   */
  place: string;
}

export interface ImageItem {
  /**
   * 图片序号，图片序号
   */
  num: number;
  /**
   * 图片链接，图片链接
   */
  url: string;
}

interface IProps {
  data: LostAndFoundArticle;
}

// 失物招领页面展示的卡片
const LostFoundCard: React.FC<IProps> = (props) => {
  const data = props.data;
  const { images, desc, type, status, createTime, place, name } = data;

  const handle = () => {
    Taro.navigateTo({
      url: '/pages/lostFoundDetail/index',
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('articleData', { data });
      }
    });
  };

  return (
    <View className={styles.container} onClick={handle}>
      <View className={styles.infoContainer}>
        {/* 内容 */}
        <View className={styles.title}>{(type === 'found' ? '寻物 | ' : '招领 | ') + name}</View>
        <View className={styles.title}>{desc.length > 20 ? desc.substring(0, 20) + '...' : desc}</View>

        <View className={styles.extra}>
          {/* 地点 */}
          <View>
            <View className={styles.address} />
            <Text>{place}</Text>
          </View>
          {/* 日期 */}
          <View>
            <View className={styles.date} />
            <Text>{dateFormat(createTime).ymd}</Text>
          </View>
          {/* 审核状态 */}
          {status !== 1 && (
            <View style={{ marginTop: '4px' }}>
              <Text>{status === 0 ? '审核中' : '审核未通过'}</Text>
            </View>
          )}
        </View>
      </View>
      {images.length !== 0 ? (
        <View className={styles.imgContainer}>
          <Image src={images[0].url} style='width: 100%; height: 100%;' />
        </View>
      ) : null}
    </View>
  );
};

export default LostFoundCard;
