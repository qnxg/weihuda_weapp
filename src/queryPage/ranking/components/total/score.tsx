import { View } from '@tarojs/components'
import React from 'react'

import style from './score.module.scss'

interface Props {
  name: string
  score: number
  rank: number
}

const Score: React.FC<Props> = ({ name, score, rank }) => {
  return (
    <View className={style.layout}>
      <View className={style.title}>{name}</View>
      <View className={style.process}>
        <View className={style.content} style={{ width: `${score}%` }} />
      </View>
      <View className={style.score}>{score}</View>
      <View className={style.tips}>排名：{rank}</View>
    </View>
  )
}

export default Score
