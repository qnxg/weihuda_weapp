import { GradeItem } from '@/apis/hdjw/grade'
import empty from '@/static/empty/no-grade.svg'
import cardIcon from '@/static/index/icon/grade.svg'
import { Block } from '@tarojs/components'
import React from 'react'
import CardEmpty from '../CardEmpty'
import CardLayout from '../CardLayout'
import GradeBanner from './components/GradeBanner'

interface GradeCardProps {
  grade?: GradeItem[]
}

const GradeCard: React.FC<GradeCardProps> = (props) => {
  const { grade } = props
  return (
    <CardLayout icon={cardIcon} title='成绩查询' moreUrl='/queryPage/grade/index'>
      <Block>
        {grade && grade.length > 0 ? (
          grade.map((item, index) => {
            if (index < 4) {
              return <GradeBanner key={item.name} grade={{ name: item.name, score: item.grade }} />
            }
          })
        ) : (
          <CardEmpty icon={empty} text='暂时没有成绩，好好学习吧' />
        )}
      </Block>
    </CardLayout>
  )
}

export default GradeCard
