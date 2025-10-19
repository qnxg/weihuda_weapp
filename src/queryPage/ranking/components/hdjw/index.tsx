import { View, Picker } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classNames from 'classnames'
import { useRef, useState } from 'react'
import styles from './index.module.scss'
import {
  getGradeRankFromHdjw,
  type HdjwGradeRank,
  type HdjwGradeRankForm,
} from '@/apis/hdjw/gradeRank'
import { getCurrentXnXq } from '@/apis/semester'
import { getUserInfoApi } from '@/apis/userInfo'
import Button from '@/components/Button'
import DisplayCard from '@/components/DisplayCard'
import PullRefresh from '@/components/PullRefresh'
import usePromise from '@/utils/hooks/usePromise'
import type { BaseEventOrig } from '@tarojs/components'

const CourseTypeList = ['', '全部', '必修', '核心']
const RankTypeList = ['', '算数平均', '加权平均', '绩点']
const buildFooterInfo = (year?: number, term?: number): string => {
  let res = ''
  if (year) {
    res += `${year} - ${year + 1} 学年`
  } else {
    res += '全部学年'
  }
  if (term) {
    if (term === 1) res += ' 秋季学期'
    else if (term === 2) res += ' 春季学期'
    else if (term === 3) res += ' 夏季学期'
  } else {
    res += ' 全部学期'
  }
  return res
}

// 获取当前学期和用户信息
const preparePrerequisites = async () => {
  const [[xn, xq], userEnterYear] = await Promise.all([
    getCurrentXnXq(),
    (async () => (await getUserInfoApi()).enter)(),
  ])
  const yearsArr: number[] = []
  for (let i = 0; userEnterYear + i <= xn; ++i) {
    yearsArr.unshift(userEnterYear + i)
  }
  return {
    currentXn: xn,
    currentXq: xq,
    selectableYears: yearsArr,
  }
}

const HdjwIndex: React.FC = () => {
  // 初始表单，默认初始查询核心加权（应该多数人关心这个）
  const initHdjwForm: HdjwGradeRankForm = {
    course: 3,
    rank: 2,
  }
  const [hdjwData, setHdjwData] = useState<HdjwGradeRank | null>(null)
  // 这里存的是已经发送请求的表单
  const [hdjwForm, setHdjwForm] = useState<HdjwGradeRankForm>(initHdjwForm)
  const hdjwFormRef = useRef(hdjwForm)

  // 根据当前学期和入学年份生成学年学期选择
  // 当前学期和用户信息
  const [prerequisites] = usePromise(preparePrerequisites, null, [
    preparePrerequisites,
  ])

  const termYearPicker = ['全部学年']
  if (prerequisites !== null) {
    for (const selectableYear of prerequisites.selectableYears) {
      termYearPicker.push(`${selectableYear} - ${selectableYear + 1} 学年`)
    }
  }

  const [[yearIndex, typeIndex], setTermPickerValue] = useState<
    [number, number]
  >([0, 0])

  const pickerChange = (e: BaseEventOrig) => {
    const [yearIndex, typeIndex] = e.detail.value
    setTermPickerValue([yearIndex, typeIndex])
  }

  const [termTypePicker, setTermTypePicker] = useState(['全部学期'])

  const columnChange = (e: BaseEventOrig) => {
    if (e.detail.column === 0) {
      if (e.detail.value === 0) {
        setTermTypePicker(['全部学期'])
      } else {
        setTermTypePicker(['全部学期', '秋季学期', '春季学期', '夏季学期'])
      }
      setTermPickerValue([e.detail.value, 0])
    }
  }

  const [hdjwFormCourse, setHdjwFormCourse] = useState(3) // 课程类型
  const [hdjwFormRank, setHdjwFormRank] = useState(2) // 排名类型
  const hdjwFormCourseRef = useRef(hdjwFormCourse)
  const hdjwFormRankRef = useRef(hdjwFormRank)

  const getData = async (form: HdjwGradeRankForm) => {
    if (prerequisites === null) {
      return
    }

    await Taro.showLoading({
      mask: true,
      title: '加载中...',
    })
    try {
      const res = await getGradeRankFromHdjw(form)
      setHdjwData(res)
      setHdjwForm(form)
      hdjwFormRef.current = form
    } catch (err) {
      await Taro.showToast({
        icon: 'none',
        title: err.toString(),
      })
      setHdjwData(null)
    }
    Taro.hideLoading()
  }

  const handleSearch = async () => {
    if (prerequisites === null) {
      return
    }

    const year =
      yearIndex === 0 ? undefined : prerequisites.selectableYears[yearIndex - 1]
    const term = typeIndex === 0 ? undefined : typeIndex
    let newForm: HdjwGradeRankForm = {
      course: hdjwFormCourseRef.current,
      rank: hdjwFormRankRef.current,
    }
    // 必须要这样，不然的话会把 year 和 term 置成 undefined，请求的时候也就带着 undefined 了
    if (year) newForm = { ...newForm, year }
    if (term) newForm = { ...newForm, term }
    await getData(newForm)
  }

  const onRefresh = async (close: () => void) => {
    await getData(hdjwFormRef.current)
    close()
  }

  return (
    <PullRefresh runFunc={onRefresh} topGap={72}>
      <View className='flex flex-col h-full'>
        <View>
          {hdjwData !== null && (
            <DisplayCard
              title={`${CourseTypeList[hdjwForm.course]}课程成绩`}
              footer={buildFooterInfo(hdjwForm.year, hdjwForm.term)}
            >
              <View className='flex'>
                <View className='flex-1'>
                  {hdjwForm.rank === 3
                    ? '绩点：'
                    : `${RankTypeList[hdjwForm.rank]}分：`}
                  <View className='inline text-primary font-bold text-lg'>
                    {hdjwData.score}
                  </View>
                </View>
                <View className='flex-1'>
                  排名：
                  <View className='inline text-primary font-bold text-lg'>
                    {hdjwData.rank}
                  </View>
                </View>
              </View>
            </DisplayCard>
          )}
          <DisplayCard title='筛选'>
            <View className='flex items-center'>
              <View className='text-xs'>课程范围：</View>
              {CourseTypeList.map((item, index) => {
                if (index === 0) return null
                return (
                  <View
                    key={item}
                    className={classNames('border rounded px-2 py-0.5 ml-1', {
                      'text-primary border-primary': hdjwFormCourse === index,
                    })}
                    onClick={() => {
                      setHdjwFormCourse(index)
                      hdjwFormCourseRef.current = index
                    }}
                  >
                    {item}
                  </View>
                )
              })}
            </View>
            <View className='flex items-center mt-2'>
              <View className='text-xs'>计算方式：</View>
              {RankTypeList.map((item, index) => {
                if (index === 0) return null
                return (
                  <View
                    key={item}
                    className={classNames('border rounded px-2 py-0.5 ml-1', {
                      'text-primary border-primary': hdjwFormRank === index,
                    })}
                    onClick={() => {
                      setHdjwFormRank(index)
                      hdjwFormRankRef.current = index
                    }}
                  >
                    {item}
                  </View>
                )
              })}
            </View>
            <View className='flex items-center mt-2'>
              <View className='text-xs'>时间范围：</View>
              <Picker
                range={[termYearPicker, termTypePicker]}
                value={[yearIndex, typeIndex]}
                mode='multiSelector'
                onColumnChange={columnChange}
                onChange={pickerChange}
                className='flex-1 mr-1'
              >
                <View className='border-b py-0.5 ml-1 w-full'>
                  {`${termYearPicker[yearIndex]} ${termTypePicker[typeIndex]}`}
                </View>
              </Picker>
            </View>
            <Button
              className='text-sm mt-4 py-2'
              onClick={handleSearch}
              disabled={prerequisites === null}
            >
              查询
            </Button>
            <View className={styles.warningInfo}>
              成绩仅供参考，请以教务系统成绩为准！
            </View>
          </DisplayCard>
        </View>
        <View className='mt-auto pt-4'>
          <View className={styles.bottomInfo}>数据来源：教务系统</View>
          <View className={styles.bottomInfo}>
            若对成绩有疑问，请联系 湖南大学信息化办
          </View>
          <View className={styles.bottomInfo}>联系方式：88821520</View>
        </View>
      </View>
    </PullRefresh>
  )
}

export default HdjwIndex
