import { ScrollView, Swiper, SwiperItem, Text, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classNames from 'classnames'
import React from 'react'
import styles from './index.module.scss'
import { deleteCourseApi } from '@/apis/hdjw/classTable'
import { refreshClassTableThunk } from '@/models/classTable'
import { useAppDispatch } from '@/utils/hooks/redux'
import type { CourseInfo } from '@/apis/hdjw/classTable'

export interface FloatProps {
  classDetailsToShow: CourseInfo[]
  clearClassDetailsToShow: () => void
}

const ClassDetailFloat: React.FC<FloatProps> = props => {
  /** 定义悬浮课程详情的数据 */
  const dispatch = useAppDispatch()
  /**
   * 隐藏float
   */
  const onHideFloat = (): void => {
    props.clearClassDetailsToShow()
  }
  const deleteCourse = async (id: number) => {
    const deleteRes = await Taro.showModal({
      title: '确认删除',
      content: '将会删除本课程并重新拉取课表',
      confirmColor: '#ff5555',
      cancelColor: '#328ccb',
    })
    if (deleteRes.confirm) {
      onHideFloat()
      try {
        await Taro.showLoading({
          title: '加载中',
          mask: true,
        })
        await deleteCourseApi(id)
        await dispatch(refreshClassTableThunk())
        Taro.hideLoading()
      } catch {
        Taro.hideLoading()
      }
    }
  }

  return (
    <View
      className={styles.firstMask}
      onClick={onHideFloat}
      style={`display: ${props.classDetailsToShow.length > 0 ? 'block' : 'none'}`}
    >
      <Swiper
        className={styles.swiper}
        previousMargin='150rpx'
        nextMargin='152rpx'
      >
        {props.classDetailsToShow.map((item, index) => {
          return (
            <SwiperItem key={String(index)} className={styles.swiperItem}>
              <View
                className={classNames(styles.card, 'shadow-lg')}
                style={`background: ${item.fontColor}`}
                onClick={(e): void => {
                  e.stopPropagation()
                }}
              >
                <ScrollView>
                  <View className='text-xs'>{item.type}</View>
                  {item.courseId && (
                    <View className='text-xs'>{item.courseId}</View>
                  )}
                  <View className={styles.className}>{item.courseName}</View>
                  <View className={styles.classOther}>
                    {(item.place || item.area) && (
                      <View>
                        {item.place
                          ? item.place + (item.area ? `(${item.area})` : '')
                          : item.area}
                      </View>
                    )}
                    {item.teacher && (
                      <View className='my-1'>{item.teacher}</View>
                    )}
                    <View className='my-1'>第 {item.weeks.join(', ')} 周</View>
                    {item.credit && (
                      <View className='my-1'>{item.credit} 学分</View>
                    )}
                    {item.extra && <View className='my-1'>{item.extra}</View>}
                  </View>
                </ScrollView>
                {item.customizeId !== -1 ? (
                  <View className={styles.optionContainer}>
                    <View
                      className={styles.options}
                      onClick={() => {
                        void deleteCourse(item.customizeId)
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

export default ClassDetailFloat
