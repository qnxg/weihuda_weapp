import { ScrollView, Swiper, SwiperItem, Text, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classNames from 'classnames'
import React from 'react'
import styles from './index.module.scss'
import { deleteCourseApi } from '@/apis/hdjw/classTable'
import type { CourseInfo } from '@/apis/hdjw/classTable'

export interface FloatProps {
  classDetailsToShow: {
    courseItem: CourseInfo
    bgColor: string
    fgColor: string
  }[]
  clearClassDetailsToShow: () => void
  refreshTable: () => void
}

/** 定义悬浮课程详情的数据 */
const ClassDetailFloat: React.FC<FloatProps> = props => {
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
        props.refreshTable()
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
        {props.classDetailsToShow.map(({ courseItem, fgColor }, index) => {
          return (
            <SwiperItem key={String(index)} className={styles.swiperItem}>
              <View
                className={classNames(styles.card, 'shadow-lg')}
                style={`background: ${fgColor}`}
                onClick={(e): void => {
                  e.stopPropagation()
                }}
              >
                <ScrollView>
                  <View className='text-xs'>{courseItem.type}</View>
                  {courseItem.courseId && (
                    <View className='text-xs'>{courseItem.courseId}</View>
                  )}
                  <View className={styles.className}>
                    {courseItem.courseName}
                  </View>
                  <View className={styles.classOther}>
                    {(courseItem.place || courseItem.area) && (
                      <View>
                        {courseItem.place
                          ? courseItem.place +
                            (courseItem.area ? `(${courseItem.area})` : '')
                          : courseItem.area}
                      </View>
                    )}
                    <View className='my-1'>{courseItem.className}</View>
                    {courseItem.teacher && (
                      <View className='my-1'>{courseItem.teacher}</View>
                    )}
                    <View className='my-1'>
                      第 {courseItem.weeks.join(', ')} 周
                    </View>
                    {courseItem.credit && (
                      <View className='my-1'>{courseItem.credit} 学分</View>
                    )}
                    {courseItem.courseId && (
                      <View className='my-1'>
                        上课人数：{courseItem.people}
                      </View>
                    )}
                    {courseItem.extra && (
                      <View className='my-1'>{courseItem.extra}</View>
                    )}
                  </View>
                </ScrollView>
                {courseItem.customizeId !== -1 ? (
                  <View className={styles.optionContainer}>
                    <View
                      className={styles.options}
                      onClick={() => {
                        void deleteCourse(courseItem.customizeId)
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
