import { Cell, Popup } from '@taroify/core'
import { ScrollView, View, Text } from '@tarojs/components'
import styles from './index.module.scss'
import '@/utils/scss/taroify.scss'
import type { ExtraCourseInfo } from '@/apis/hdjw/classTable'

interface ExtraCourseProps {
  open: boolean
  onClose: () => void
  data: ExtraCourseInfo[]
}

const ExtraCourse: React.FC<ExtraCourseProps> = ({ open, onClose, data }) => {
  const countIndicator = data.length > 0 ? `（${data.length}）` : ''

  return (
    <Popup lock open={open} onClose={onClose} placement='bottom' rounded>
      <View className={styles.popupContent}>
        <Text className='p-3 text-base'>无课表课程{countIndicator}</Text>
        <ScrollView className={styles.scrollArea} scrollY>
          <View className={styles.wrapper}>
            {data.length > 0 ? (
              data.map((item, index) => (
                <Cell.Group key={`${item.className}-${index}`} className='mb-3'>
                  <View className='text-sm mx-3'>{item.courseName}</View>
                  <Cell title='课程代码'>{item.courseId}</Cell>
                  <Cell title='教师'>{item.teacher}</Cell>
                  <Cell title='上课班级'>{item.className}</Cell>
                  <Cell title='校区'>{item.area}</Cell>
                  <Cell title='课程性质'>{item.type}</Cell>
                  <Cell title='学分'>{item.credit}</Cell>
                  <Cell title='人数'>{item.people}</Cell>
                  {item.extra && <Cell title='备注'>{item.extra}</Cell>}
                </Cell.Group>
              ))
            ) : (
              <View className='px-3 pb-3'>暂无无课表课程</View>
            )}
          </View>
        </ScrollView>
      </View>
    </Popup>
  )
}

export default ExtraCourse
