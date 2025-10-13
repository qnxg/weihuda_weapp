import { Block } from '@tarojs/components'
import React, { useEffect } from 'react'
import CardEmpty from '../utils/CardEmpty'
import CardLayout from '../utils/CardLayout'
import GradeBanner from './components/GradeBanner'
import { getThisSemesterGrade } from '@/apis/hdjw/grade'
import empty from '@/static/empty/no-grade.svg'
import cardIcon from '@/static/index/icon/grade.svg'
import usePromise from '@/utils/hooks/usePromise'
import type CardProps from '../../CardProps'
import type { GradeItem } from '@/apis/hdjw/grade'

interface GradeCardProps {
  grade?: GradeItem[]
}

const GradeCardDisPlay: React.FC<GradeCardProps> = props => {
  const { grade } = props
  return (
    <CardLayout
      icon={cardIcon}
      title='成绩查询'
      moreUrl='/queryPage/grade/index'
    >
      <Block>
        {grade && grade.length > 0 ? (
          grade.map((item, index) => {
            if (index < 4) {
              return (
                <GradeBanner
                  key={item.courseName}
                  grade={{
                    name: item.courseName,
                    score: item.score,
                  }}
                />
              )
            }
          })
        ) : (
          <CardEmpty icon={empty} text='暂时没有成绩，好好学习吧' />
        )}
      </Block>
    </CardLayout>
  )
}

const GradeCard: React.FC<CardProps> = ({
  onLoadingStatusChange,
  reloadController,
}) => {
  const [gradeData, loadingGradeData] = usePromise(
    getThisSemesterGrade,
    [],
    [getThisSemesterGrade, reloadController]
  )

  useEffect(() => {
    onLoadingStatusChange(loadingGradeData)
  }, [loadingGradeData, onLoadingStatusChange])

  return <GradeCardDisPlay grade={gradeData} />
}

export default GradeCard
