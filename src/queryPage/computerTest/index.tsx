import { Block, Image, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import React, { useEffect, useState } from 'react'
import styles from './index.module.scss'
import { ExamArrange, getComputerExam } from '@/apis/hdjw/computerExam'
import LineDividedLeftRightCard from '@/components/LineDividedLeftRightCard'
import LeftPart from '@/components/LineDividedLeftRightCard/components/LeftPart'
import RightPart from '@/components/LineDividedLeftRightCard/components/RightPart'
import PullRefresh from '@/components/PullRefresh'
import iconNoJK from '@/static/empty/no-exam.svg'
import location from '@/static/icon/location.svg'
import { onColors } from '@/utils/config'

const Index: React.FC = () => {
  const [show, setShow] = useState(false)

  const [data, setData] = useState<ExamArrange[] | null>(null)

  /**
   * 获取数据
   */
  const getData = async () => {
    await Taro.showLoading({
      mask: true,
      title: '加载中...'
    })
    try {
      const res = await getComputerExam()
      if (!res) {
        setShow(false)
      } else {
        setData(res)
        setShow(true)
      }
    } catch (err) {
      setShow(false)
      await Taro.showToast({
        icon: 'none',
        title: err.toString()
      })
    } finally {
      Taro.hideLoading()
    }
  }

  useEffect(() => {
    void getData()
  }, [])

  const onRefresh = async (close) => {
    await getData()
    close()
  }

  return (
    <PullRefresh runFunc={onRefresh}>
      {show && data && data.length !== 0 ? (
        <View className={styles.outer}>
          {data.map((item, index) => {
            const start = item.startTime.split(' ')
            const end = item.endTime.split(' ')
            const day = start[0].replace(/-/g, '/')
            return (
              <LineDividedLeftRightCard
                key={item.name}
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
            )
          })}
        </View>
      ) : (
        <View className={styles.container}>
          <Image src={iconNoJK} className={styles.iconNoJK} />
          <View className={styles.text}>暂时没有机考，好好学习吧</View>
        </View>
      )}
    </PullRefresh>
  )
}

export default Index
