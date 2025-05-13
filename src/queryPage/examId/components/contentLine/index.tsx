import { Block, Image, View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import React, { useMemo, useState } from 'react';
import { useShowModal } from '../modal';
import styles from './index.module.scss';
import LineDividedLeftRightCard from '@/components/LineDividedLeftRightCard';
import LeftPart from '@/components/LineDividedLeftRightCard/components/LeftPart';
import RightPart from '@/components/LineDividedLeftRightCard/components/RightPart';
import topStar from '@/static/examId/top-star.svg';
import type { ExamId } from '../../interface';
import type { ITouchEvent} from '@tarojs/components';

interface Props {
  index: number;
  lineColor: string;
  examIdItem: ExamId;
  type: 'topping' | 'unfinished' | 'finished';
  addTopping: (index: number) => void;
  deleteTopping: (index: number) => void;
  deleteItem: (index: number, type: 'topping' | 'unfinished' | 'finished') => void;
}

const INIT_OFFSET = 0;
const OFFSET_THRES = -280;
const TOPPING_OFFSET_THRES = -340;
const DELETE_ONLY_THRES = -140;
const MOVE_DISTANCE = 75;

// 可滑动的卡片
const Index: React.FC<Props> = (props) => {
  const { index, lineColor, examIdItem, type, addTopping, deleteTopping, deleteItem } = props;

  // 滑动偏移值
  const offsetThres = useMemo(
    () => (type === 'finished' ? DELETE_ONLY_THRES : type === 'topping' ? TOPPING_OFFSET_THRES : OFFSET_THRES),
    [type]
  );

  const [leftOffset, setLeftOffset] = useState<number>(INIT_OFFSET);
  const [startX, setStartX] = useState<number>(0);
  const [originOffset, setOriginOffset] = useState<number>(INIT_OFFSET);
  const [transitionTime, setTransitionTime] = useState<number>(0);

  // 用于显示确认弹窗
  const [showModal] = useShowModal();

  // 长按复制考号
  const handleLongPress = () => {
    void Taro.setClipboardData({
      data: examIdItem.examId
    });
  };

  const handleTouchStart = (e: ITouchEvent): void => {
    setStartX(e.touches[0].pageX);
    setOriginOffset(leftOffset);
    setTransitionTime(0);
  };

  const handleTouchMove = (e: ITouchEvent): void => {
    const curX = e.touches[0].pageX;
    const off = originOffset + curX - startX;
    if (off >= INIT_OFFSET) {
      setLeftOffset(INIT_OFFSET);
    } else if (off <= offsetThres) {
      setLeftOffset(offsetThres);
    } else {
      setLeftOffset(off);
    }
  };

  const handleTouchEnd = (): void => {
    setTransitionTime(300);
    const isLefted = originOffset < INIT_OFFSET;
    if (isLefted) {
      if (leftOffset - originOffset > MOVE_DISTANCE) {
        setLeftOffset(INIT_OFFSET);
        setOriginOffset(INIT_OFFSET);
      } else {
        setLeftOffset(offsetThres);
        setOriginOffset(offsetThres);
      }
    } else {
      if (originOffset - leftOffset > MOVE_DISTANCE) {
        setLeftOffset(offsetThres);
        setOriginOffset(offsetThres);
      } else {
        setLeftOffset(INIT_OFFSET);
        setOriginOffset(INIT_OFFSET);
      }
    }
  };

  const handleToTop = (): void => {
    addTopping(index);
    setLeftOffset(INIT_OFFSET);
  };

  const handleCancelTop = (): void => {
    deleteTopping(index);
    setLeftOffset(INIT_OFFSET);
  };

  const handleDelete = (): void => {
    showModal({
      content: '确认删除这一项吗',
      cancelText: '取消删除',
      confirmText: '确认删除',
      onCancel: () => {},
      onConfirm: () => {
        deleteItem(index, type);
        setLeftOffset(INIT_OFFSET);
      }
    });
  };

  return (
    <View
      className={styles.container}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onLongPress={handleLongPress}
    >
      <View
        className={styles.lineWrapper}
        style={{ marginLeft: `${leftOffset}rpx`, transition: `ease-out ${transitionTime}ms` }}
      >
        <LineDividedLeftRightCard
          lineColor={lineColor}
          renderLeft={<LeftPart title={examIdItem.sub} content={examIdItem.examDate} />}
          style='flex-shrink:0;margin:0;box-shadow:none;border-top-right-radius:0;border-bottom-right-radius:0;'
          renderRight={
            <RightPart
              title={examIdItem.examName}
              subTitle={type === 'topping' ? <Image src={topStar} className={styles.topStar} /> : ''}
              renderContent={<Block>{`考号：${examIdItem.examId}`}</Block>}
            />
          }
        />
        <View className={styles.choiceContainer}>
          {type !== 'finished' && (
            <View
              className={`${styles.choiceCard} ${type === 'topping' ? styles.topped : styles.topping}`}
              onClick={type === 'topping' ? handleCancelTop : handleToTop}
            >
              {type === 'topping' ? '取消置顶' : '置顶'}
            </View>
          )}
          <View className={`${styles.choiceCard} ${styles.delete}`} onClick={handleDelete}>
            删除
          </View>
        </View>
      </View>
    </View>
  );
};

export default Index;
