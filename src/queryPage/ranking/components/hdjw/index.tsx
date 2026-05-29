import { View, Picker } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classNames from 'classnames'
import { useRef, useState } from 'react'
import GradeCard from '../gradeCard'
import styles from './index.module.scss'
import {
  getGradeRankFromHdjw,
  type HdjwGradeRankForm,
  type HdjwRank,
} from '@/apis/hdjw/gradeRank'
import { getCurrentXnXq } from '@/apis/semester'
import { getUserInfoApi } from '@/apis/userInfo'
import Button from '@/components/Button'
import DisplayCard from '@/components/DisplayCard'
import PullRefresh from '@/components/PullRefresh'
import usePromise from '@/utils/hooks/usePromise'
import type { BaseEventOrig } from '@tarojs/components'

const CourseRangeList = ['', '主修', '辅修']
const DataSourceList = ['', '成绩主库', '执行方案']
const DisplayTypeList = ['', '最大成绩', '初修成绩']
const buildFooterTermInfo = (year?: number, term?: number): string => {
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
  // 当前表单，默认选择主修、执行方案、初修成绩
  const [hdjwForm, setHdjwForm] = useState<HdjwGradeRankForm>({
    data_source: 2,
    display: 2,
    range: 1,
  })
  // 根据当前学期和入学年份生成学年学期选择
  // 当前学期和用户信息
  const [prerequisites] = usePromise(preparePrerequisites, null, [
    preparePrerequisites,
  ])
  // 学年学期单独拿出来
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

  // 这里存的是已经发送请求的表单，用于显示在结果页面或者下拉刷新
  // 区别于当前表单，这里不随当前表单的变化而变化
  const [hdjwFormSent, setHdjwFormSent] = useState<HdjwGradeRankForm | null>(
    null
  )
  const hdjwFormSentRef = useRef(hdjwFormSent)

  // 结果数据
  const [hdjwData, setHdjwData] = useState<HdjwRank | null>(null)

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
      setHdjwFormSent(form)
      hdjwFormSentRef.current = form
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

    const form = {
      ...hdjwForm,
    }
    if (yearIndex !== 0) {
      form.xn = prerequisites.selectableYears[yearIndex - 1]
    }
    if (typeIndex !== 0) {
      form.xq = typeIndex
    }

    await getData(form)
  }

  const onRefresh = async (close: () => void) => {
    if (hdjwFormSentRef.current !== null) {
      await getData(hdjwFormSentRef.current)
    }
    close()
  }

  return (
    <PullRefresh runFunc={onRefresh} topGap={72}>
      <View className='flex flex-col h-full'>
        <View>
          <DisplayCard title='筛选'>
            <View className='flex items-center'>
              <View className='text-xs'>数据来源：</View>
              {DataSourceList.map((item, index) => {
                if (index === 0) return null
                return (
                  <View
                    key={item}
                    className={classNames('border rounded px-2 py-0.5 ml-1', {
                      'text-primary border-primary':
                        hdjwForm.data_source === index,
                    })}
                    onClick={() => {
                      setHdjwForm({ ...hdjwForm, data_source: index })
                    }}
                  >
                    {item}
                  </View>
                )
              })}
            </View>
            <View className='flex items-center mt-2'>
              <View className='text-xs'>课程范围：</View>
              {CourseRangeList.map((item, index) => {
                if (index === 0) return null
                return (
                  <View
                    key={item}
                    className={classNames('border rounded px-2 py-0.5 ml-1', {
                      'text-primary border-primary': hdjwForm.range === index,
                    })}
                    onClick={() => {
                      setHdjwForm({ ...hdjwForm, range: index })
                    }}
                  >
                    {item}
                  </View>
                )
              })}
            </View>
            <View className='flex items-center mt-2'>
              <View className='text-xs'>显示方式：</View>
              {DisplayTypeList.map((item, index) => {
                if (index === 0) return null
                return (
                  <View
                    key={item}
                    className={classNames('border rounded px-2 py-0.5 ml-1', {
                      'text-primary border-primary': hdjwForm.display === index,
                    })}
                    onClick={() => {
                      setHdjwForm({ ...hdjwForm, display: index })
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
          {hdjwData !== null && hdjwFormSent !== null && (
            <>
              <DisplayCard>
                <View>
                  {buildFooterTermInfo(hdjwFormSent.xn, hdjwFormSent.xq)}
                </View>
                <View>
                  {DataSourceList[hdjwFormSent.data_source]}
                  {' / '}
                  {CourseRangeList[hdjwFormSent.range]}
                  {' / '}
                  {DisplayTypeList[hdjwFormSent.display]}
                </View>
              </DisplayCard>
              <GradeCard
                title='全部课程'
                grade={
                  hdjwData.all
                    ? {
                        arithmetic: hdjwData.all.arithmetic,
                        weighted: hdjwData.all.weighted,
                        gpa: hdjwData.all.gpa,
                      }
                    : undefined
                }
                rank={
                  hdjwData.all
                    ? {
                        arithmetic: hdjwData.all.arithmetic_rank,
                        weighted: hdjwData.all.weighted_rank,
                        gpa: hdjwData.all.gpa_rank,
                      }
                    : undefined
                }
              />
              <GradeCard
                title='必修课程'
                grade={
                  hdjwData.must
                    ? {
                        arithmetic: hdjwData.must.arithmetic,
                        weighted: hdjwData.must.weighted,
                        gpa: hdjwData.must.gpa,
                      }
                    : undefined
                }
                rank={
                  hdjwData.must
                    ? {
                        arithmetic: hdjwData.must.arithmetic_rank,
                        weighted: hdjwData.must.weighted_rank,
                        gpa: hdjwData.must.gpa_rank,
                      }
                    : undefined
                }
              />
              <GradeCard
                title='核心课程'
                grade={
                  hdjwData.core
                    ? {
                        arithmetic: hdjwData.core.arithmetic,
                        weighted: hdjwData.core.weighted,
                        gpa: hdjwData.core.gpa,
                      }
                    : undefined
                }
                rank={
                  hdjwData.core
                    ? {
                        arithmetic: hdjwData.core.arithmetic_rank,
                        weighted: hdjwData.core.weighted_rank,
                        gpa: hdjwData.core.gpa_rank,
                      }
                    : undefined
                }
              />
            </>
          )}
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
