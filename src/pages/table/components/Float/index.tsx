import { deleteCourseApi } from '@/apis/hdjw/classTable'
import { useAppDispatch, useAppSelector } from '@/utils/hooks/redux'
import { refreshClassTableThunk, saveClassTable } from '@/models/classTable'
import { ScrollView, Swiper, SwiperItem, Text, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import React from 'react'
import styles from './index.module.scss'

export interface FloatProps {
  showFloat: boolean
}

const Float: React.FC<FloatProps> = ({ showFloat = false }) => {
  /** 定义悬浮课程详情的数据 */
  const { floatData } = useAppSelector((state) => state.classTable)
  const dispatch = useAppDispatch()
  /**
   * 隐藏float
   */
  const onHideFloat = (): void => {
    dispatch(
      saveClassTable({
        showFloat: false
      })
    )
  }
  const deleteCourse = async (id) => {
    const deleteRes = await Taro.showModal({
      title: '确认删除',
      content: '将会删除本课程并重新拉取课表',
      confirmColor: '#ff5555',
      cancelColor: '#328ccb'
    })
    if (deleteRes.confirm) {
      onHideFloat()
      try {
        await Taro.showLoading({
          title: '加载中',
          mask: true
        })
        await deleteCourseApi(parseInt(id))
        await dispatch(refreshClassTableThunk())
        Taro.hideLoading()
      } catch (err) {
        Taro.hideLoading()
      }
    }
  }

  return (
    <View className={styles.firstMask} onClick={onHideFloat} style={`display: ${showFloat ? 'block' : 'none'}`}>
      <Swiper className={styles.swiper} previousMargin='150rpx' nextMargin='152rpx'>
        {floatData.map((item, index) => {
          return (
            <SwiperItem key={String(index)} className={styles.swiperItem}>
              <View
                className={styles.card}
                style={`background: ${item.bgColor}`}
                onClick={(e): void => {
                  e.stopPropagation()
                }}
              >
                <ScrollView>
                  <View className={styles.classId}>[{!item.classId ? '自定义课程' : item.classId}]</View>
                  <View className={styles.className}>{item.classname}</View>
                  <View className={styles.classOther}>
                    <View>{item.location ? item.location : ''}</View>
                    <View>{item.teachers}</View>
                    <View className={styles.rangeEvenOdd}>[{item.week}周]</View>
                    <View>第{item.section}节</View>
                    <View>{item.skqk}</View>
                  </View>
                </ScrollView>
                {String(item.type) === '2' ? (
                  <View className={styles.optionContainer}>
                    <View
                      className={styles.options}
                      onClick={(): void => {
                        deleteCourse(item.id)
                      }}
                    >
                      <View className={styles.removeIcon} />
                      <Text>删除</Text>
                    </View>
                  </View>
                ) : null}
              </View>
            </SwiperItem>
          )
        })}
      </Swiper>
    </View>
  )
}

export default Float
