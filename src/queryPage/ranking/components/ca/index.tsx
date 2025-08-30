import { View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useEffect, useState } from 'react'
import { type CaGradeRank, getGradeRankFromCa } from '@/apis/hdjw/gradeRank'
import DisplayCard from '@/components/DisplayCard'
import PullRefresh from '@/components/PullRefresh'

const getRank = (str?: string) => {
  if (!str) return '无数据'
  const [a, b] = str.split('/')
  if (!b) return '无数据'
  return a
}

const getRankTotal = (str?: string) => {
  if (!str) return null
  const [_, b] = str.split('/')
  if (!b) return null
  return b
}

// 保留两位小数，并去掉多余的 0
const formatDecimal = num => {
  return parseFloat(num.toFixed(2)).toString()
}

const CaIndex = () => {
  const [data, setData] = useState<CaGradeRank | null>(null)
  const getData = async () => {
    await Taro.showLoading({
      mask: true,
      title: '加载中...',
    })
    try {
      const res = await getGradeRankFromCa()
      setData(res)
    } catch (err) {
      await Taro.showToast({
        icon: 'none',
        title: err.toString(),
      })
    }
    Taro.hideLoading()
  }
  const onRefresh = async close => {
    await getData()
    close()
  }
  useEffect(() => {
    void getData()
  }, [])
  return (
    <PullRefresh runFunc={onRefresh}>
      <DisplayCard title='全部课程成绩'>
        <View className='flex'>
          <View className='flex-1'>
            算数平均分：
            <View className='inline text-primary font-bold text-lg'>
              {data?.all_arithmetic ?? '无数据'}
            </View>
          </View>
          <View className='flex-1'>
            排名：
            <View className='inline text-primary font-bold text-lg'>
              {getRank(data?.all_arithmetic_rank)}
            </View>
            {getRankTotal(data?.all_arithmetic_rank) && (
              <View className='inline text-primary font-bold text-xs'>
                /{getRankTotal(data?.all_arithmetic_rank)}
              </View>
            )}
          </View>
        </View>
        <View className='flex'>
          <View className='flex-1'>
            加权平均分：
            <View className='inline text-primary font-bold text-lg'>
              {data?.all_weighted ?? '无数据'}
            </View>
          </View>
          <View className='flex-1'>
            排名：
            <View className='inline text-primary font-bold text-lg'>
              {getRank(data?.all_weighted_rank)}
            </View>
            {getRankTotal(data?.all_weighted_rank) && (
              <View className='inline text-primary font-bold text-xs'>
                /{getRankTotal(data?.all_weighted_rank)}
              </View>
            )}
          </View>
        </View>
        <View className='flex'>
          <View className='flex-1'>
            算数平均分：
            <View className='inline text-primary font-bold text-lg'>
              {data?.all_gpa ?? '无数据'}
            </View>
          </View>
          <View className='flex-1'>
            排名：
            <View className='inline text-primary font-bold text-lg'>
              {getRank(data?.all_gpa_rank)}
            </View>
            {getRankTotal(data?.all_gpa_rank) && (
              <View className='inline text-primary font-bold text-xs'>
                /{getRankTotal(data?.all_gpa_rank)}
              </View>
            )}
          </View>
        </View>
      </DisplayCard>
      <DisplayCard title='必修课程成绩'>
        <View className='flex'>
          <View className='flex-1'>
            算数平均分：
            <View className='inline text-primary font-bold text-lg'>
              {data?.must_arithmetic ?? '无数据'}
            </View>
          </View>
        </View>
        <View className='flex'>
          <View className='flex-1'>
            加权平均分：
            <View className='inline text-primary font-bold text-lg'>
              {data?.must_weighted ?? '无数据'}
            </View>
          </View>
        </View>
        <View className='flex'>
          <View className='flex-1'>
            绩点：
            <View className='inline text-primary font-bold text-lg'>
              {data?.must_gpa ?? '无数据'}
            </View>
          </View>
        </View>
      </DisplayCard>
      <DisplayCard title='核心课程成绩'>
        <View className='flex'>
          <View className='flex-1'>
            算数平均排名：
            <View className='inline text-primary font-bold text-lg'>
              {getRank(data?.core_arithmetic_rank)}
            </View>
            {getRankTotal(data?.core_arithmetic_rank) && (
              <>
                <View className='inline text-primary font-bold text-xs'>
                  /{getRankTotal(data?.core_arithmetic_rank)}
                </View>
                <View className='inline ml-0.5'>
                  (前
                  {formatDecimal(
                    (Number(getRank(data?.core_arithmetic_rank)) /
                      Number(getRankTotal(data?.core_arithmetic_rank))) *
                      100
                  )}
                  %)
                </View>
              </>
            )}
          </View>
        </View>
        <View className='flex'>
          <View className='flex-1'>
            加权平均排名：
            <View className='inline text-primary font-bold text-lg'>
              {getRank(data?.core_weighted_rank)}
            </View>
            {getRankTotal(data?.core_weighted_rank) && (
              <>
                <View className='inline text-primary font-bold text-xs'>
                  /{getRankTotal(data?.core_weighted_rank)}
                </View>
                <View className='inline ml-0.5'>
                  (前
                  {formatDecimal(
                    (Number(getRank(data?.core_weighted_rank)) /
                      Number(getRankTotal(data?.core_weighted_rank))) *
                      100
                  )}
                  %)
                </View>
              </>
            )}
          </View>
        </View>
        <View className='flex'>
          <View className='flex-1'>
            绩点排名：
            <View className='inline text-primary font-bold text-lg'>
              {getRank(data?.core_gpa_rank)}
            </View>
            {getRankTotal(data?.core_gpa_rank) && (
              <>
                <View className='inline text-primary font-bold text-xs'>
                  /{getRankTotal(data?.core_gpa_rank)}
                </View>
                <View className='inline ml-0.5'>
                  (前
                  {formatDecimal(
                    (Number(getRank(data?.core_gpa_rank)) /
                      Number(getRankTotal(data?.core_gpa_rank))) *
                      100
                  )}
                  %)
                </View>
              </>
            )}
          </View>
        </View>
      </DisplayCard>
    </PullRefresh>
  )
}

export default CaIndex
