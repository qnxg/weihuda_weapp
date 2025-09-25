import { View } from '@tarojs/components'
import React from 'react'
import ContentLine from '../contentLine'
import styles from './index.module.scss'
import { Theme1 } from '@/utils/colors'
import type { ExamId } from '../../interface'

interface Props {
  unExamIds?: ExamId[]
  topExamIds?: ExamId[]
  addTopping: (index: number) => void
  deleteTopping: (index: number) => void
  deleteItem: (
    index: number,
    type: 'topping' | 'unfinished' | 'finished'
  ) => void
}

const Index: React.FC<Props> = props => {
  const { unExamIds, topExamIds, addTopping, deleteTopping, deleteItem } = props

  return (
    <View className={styles.container}>
      {topExamIds?.map((item, index) => (
        <ContentLine
          key={item.keyId}
          lineColor={Theme1[index % Theme1.length]!}
          examIdItem={item}
          index={index}
          addTopping={addTopping}
          deleteTopping={deleteTopping}
          deleteItem={deleteItem}
          type='topping'
        />
      ))}
      {unExamIds?.map((item, index) => (
        <ContentLine
          key={item.keyId}
          lineColor={
            Theme1[(index + (topExamIds?.length || 0)) % Theme1.length]!
          }
          examIdItem={item}
          index={index}
          addTopping={addTopping}
          deleteTopping={deleteTopping}
          deleteItem={deleteItem}
          type='unfinished'
        />
      ))}
    </View>
  )
}

export default Index
