import { getGrade, GradeItem } from '@/apis/hdjw/grade'
import empty from '@/static/empty/no-grade.svg'
import cardIcon from '@/static/index/icon/grade.svg'
import { Block } from '@tarojs/components'
import { useAppSelector } from '@/hooks/redux'
import React, { useEffect, useState } from 'react'
import CardEmpty from '../CardEmpty'
import CardLayout from '../CardLayout'
import GradeBanner from './components/GradeBanner'
import CardProps from '../CardProps'

interface GradeCardProps {
  grade?: GradeItem[]
}

const GradeCardDisPlay: React.FC<GradeCardProps> = (props) => {
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

const GradeCard: React.FC<CardProps> = ({ onLoadingStatusChange, reloadController }) => {
  const { termYear, termType } = useAppSelector((state) => state.smester)
  const [gradeData, setGradeData] = useState<undefined | GradeItem[]>(undefined);
  useEffect(() => {
    onLoadingStatusChange(false)
  }, [onLoadingStatusChange])
  useEffect(() => {
    (async () => {
      // 初始的termType为null的时候不用去获取数据，所以需要跳过第一次获取
      if (!termType) return;
      onLoadingStatusChange(true)
      try {
        setGradeData(await getGrade(termYear, termType))
      } finally {
        onLoadingStatusChange(false)
      }
    })()
  }, [termType, termYear, onLoadingStatusChange, reloadController])
  return <GradeCardDisPlay grade={gradeData} />
}

export default GradeCard
