import { View, Image } from '@tarojs/components'
import React from 'react'
import ExamArrangeItem from '../ExamArrangeItem'
import styles from './index.module.scss'
import iconNoK from '@/static/empty/no-exam.svg'
import { Theme1 } from '@/utils/colors'
import type { ExamArrange } from '@/apis/hdjw/examArrange'

interface Props {
  exam: ExamArrange[]
}

const Index: React.FC<Props> = props => {
  const { exam = [] } = props
  if (exam.length !== 0) {
    return (
      <View>
        {exam.map((item, index) => {
          return (
            <ExamArrangeItem
              key={`${item.name}${1000 - index}`}
              data={item}
              lineColor={Theme1[index % Theme1.length]!}
            />
          )
        })}
      </View>
    )
  }

  return (
    <View className={styles.container}>
      <Image src={iconNoK} className={styles.iconNoJK} />
      <View className={styles.text}>暂时没有考试，好好学习吧</View>
    </View>
  )
}

export default Index
