import { Picker, View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useEffect, useRef, useState } from 'react'
import styles from './index.module.scss'
import { getLabGrade, getLabSemInfo } from '@/apis/lab'
import Button from '@/components/Button'
import DisplayCard from '@/components/DisplayCard'
import PullRefresh from '@/components/PullRefresh'
import type { LabGrade, LabSemInfo } from '@/apis/lab';
import type { BaseEventOrig} from '@tarojs/components';

const NormalLabIndex: React.FC = () => {
  const [semesterIndex, setSemesterIndex] = useState(0)
  const semesterIndexRef = useRef(semesterIndex)
  const [semesterList, setSemesterList] = useState<string[]>([])
  const semesterListRef = useRef<LabSemInfo[]>([])
  const [grade, setGrade] = useState<LabGrade | null>(null)
  const getData = async () => {
    await Taro.showLoading({
      mask: true,
      title: '加载中...',
    })
    try {
      if (semesterListRef.current.length === 0) {
        const semester_res = await getLabSemInfo()
        if (!semester_res) {
          Taro.hideLoading()
          await Taro.navigateTo({
            url: '/settingsPage/labBindSettings/index?tips=true',
          })
          return
        }
        semester_res.reverse()
        setSemesterList(
          semester_res.map(
            item => `${item.xn}-${item.xn + 1} 学年第 ${item.xq} 学期`
          )
        )
        semesterListRef.current = semester_res
      }
      const sem_id = semesterListRef.current[semesterIndexRef.current]?.id
      if (!sem_id) {
        // 感觉不太可能发生，随便处理
        Taro.hideLoading()
        return
      }
      const grade_res = await getLabGrade(sem_id)
      setGrade(grade_res)
    } catch (err) {
      await Taro.showToast({
        icon: 'none',
        title: err.toString(),
      })
    }
    Taro.hideLoading()
  }
  const pickerChange = (e: BaseEventOrig) => {
    setSemesterIndex(e.detail.value)
    semesterIndexRef.current = e.detail.value
  }
  useEffect(() => {
    void getData()
  }, [])
  const onRefresh = async (close: () => void) => {
    await getData()
    close()
  }
  return (
    <PullRefresh runFunc={onRefresh} topGap={72}>
      <DisplayCard title='选择课程学期'>
        <Picker
          range={semesterList}
          value={semesterIndex}
          onChange={pickerChange}
        >
          <View className='border-b pb-2 w-full text-xs'>
            {semesterList[semesterIndex] || '暂无学期信息'}
          </View>
        </Picker>
        <Button className='text-sm mt-2 py-2' onClick={getData}>
          查询
        </Button>
      </DisplayCard>
      {grade ? (
        <>
          <DisplayCard title={grade.course_name}>
            总成绩：
            {grade.course_score ? `${grade.course_score} 分` : '暂未公布'}
          </DisplayCard>
          <View className={styles.title}>实验成绩</View>
          <View className={styles.subtitle}>下列实验中不包含虚拟实验。</View>
          {grade.labs.length > 0 ? (
            grade.labs.map(item => (
              <DisplayCard title={item.lab_name} key={item.lab_name}>
                {item.attendance && <View>考勤：{item.attendance}</View>}
                <View>总成绩：{item.lab_score} 分</View>
                {item.details.map(detail => (
                  <View key={detail.name}>
                    {detail.name}：{detail.score} 分
                  </View>
                ))}
              </DisplayCard>
            ))
          ) : (
            <DisplayCard>暂无实验成绩</DisplayCard>
          )}
        </>
      ) : (
        <DisplayCard>
          <Text>当前学期没有选修大物实验课程</Text>
        </DisplayCard>
      )}
    </PullRefresh>
  )
}

export default NormalLabIndex
