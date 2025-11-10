import { Block } from '@tarojs/components'
import styles from './index.module.scss'
import LineDividedLeftRightCard from '@/components/LeftRightCard'
import LeftPart from '@/components/LeftRightCard/components/LeftPart'
import RightPart from '@/components/LeftRightCard/components/RightPart'
import location from '@/static/icon/location.svg'
import type { ExamArrange } from '@/apis/hdjw/examArrange'

export interface ExamArrangeItemProps {
  data: ExamArrange
  lineColor: string
}

const ExamArrangeItem: React.FC<ExamArrangeItemProps> = props => {
  const { data, lineColor } = props
  let seat = ''
  if (data.seat != '无') {
    seat = `座位${data.seat}号`
  }
  return (
    <LineDividedLeftRightCard
      className={styles.cardOuter}
      lineColor={lineColor}
      renderLeft={<LeftPart title={data.date} content={data.time} />}
      renderRight={
        <RightPart
          title={data.name}
          subTitle={data.id}
          renderContent={<Block>{`${data.place} ${seat}`}</Block>}
          icon={location}
        />
      }
    />
  )
}

export default ExamArrangeItem
