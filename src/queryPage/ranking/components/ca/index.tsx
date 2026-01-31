import { View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import styles from './index.module.scss'
import {
  type CaGradeRank,
  getGradeRankFromCa,
  refreshCaGradeRank,
} from '@/apis/hdjw/gradeRank'
import Button from '@/components/Button'
import DisplayCard from '@/components/DisplayCard'
import NoData from '@/components/NoData'
import PullRefresh from '@/components/PullRefresh'
import NoDataIcon from '@/static/empty/term-not-start.svg'

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
const formatDecimal = (num: number) => {
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
  const onRefresh = async (close: () => void) => {
    await getData()
    close()
  }
  const handleRefresh = async () => {
    await Taro.showLoading({
      mask: true,
      title: '加载中...',
    })
    try {
      await refreshCaGradeRank()
      setData(null)
    } catch (err) {
      await Taro.showToast({
        icon: 'none',
        title: err.toString(),
      })
    }
    Taro.hideLoading()
  }
  useEffect(() => {
    void getData()
  }, [])
  return (
    <PullRefresh runFunc={onRefresh} topGap={72}>
      {data ? (
        <View className='flex flex-col h-full'>
          <DisplayCard>
            <View className='flex items-center'>
              <View>
                最后更新于：{dayjs(data.update_at).format('YYYY-MM-DD HH:mm')}
              </View>
              <Button
                className='w-[180px] h-[60px] ml-auto text-[24px] mx-0'
                onClick={handleRefresh}
              >
                更新
              </Button>
            </View>
          </DisplayCard>
          <View>
            <DisplayCard title='全部课程成绩'>
              <View className='flex'>
                <View className='flex-1'>
                  算数平均分：
                  <View className='inline text-primary font-bold text-lg'>
                    {data.detail.all_arithmetic ?? '无数据'}
                  </View>
                </View>
                <View className='flex-1'>
                  排名：
                  <View className='inline text-primary font-bold text-lg'>
                    {getRank(data.detail.all_arithmetic_rank)}
                  </View>
                  {getRankTotal(data.detail.all_arithmetic_rank) && (
                    <View className='inline text-primary font-bold text-xs'>
                      /{getRankTotal(data.detail.all_arithmetic_rank)}
                    </View>
                  )}
                </View>
              </View>
              <View className='flex'>
                <View className='flex-1'>
                  加权平均分：
                  <View className='inline text-primary font-bold text-lg'>
                    {data.detail.all_weighted ?? '无数据'}
                  </View>
                </View>
                <View className='flex-1'>
                  排名：
                  <View className='inline text-primary font-bold text-lg'>
                    {getRank(data.detail.all_weighted_rank)}
                  </View>
                  {getRankTotal(data.detail.all_weighted_rank) && (
                    <View className='inline text-primary font-bold text-xs'>
                      /{getRankTotal(data.detail.all_weighted_rank)}
                    </View>
                  )}
                </View>
              </View>
              <View className='flex'>
                <View className='flex-1'>
                  绩点：
                  <View className='inline text-primary font-bold text-lg'>
                    {data.detail.all_gpa ?? '无数据'}
                  </View>
                </View>
                <View className='flex-1'>
                  排名：
                  <View className='inline text-primary font-bold text-lg'>
                    {getRank(data.detail.all_gpa_rank)}
                  </View>
                  {getRankTotal(data.detail.all_gpa_rank) && (
                    <View className='inline text-primary font-bold text-xs'>
                      /{getRankTotal(data.detail.all_gpa_rank)}
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
                    {data.detail.must_arithmetic ?? '无数据'}
                  </View>
                </View>
              </View>
              <View className='flex'>
                <View className='flex-1'>
                  加权平均分：
                  <View className='inline text-primary font-bold text-lg'>
                    {data.detail.must_weighted ?? '无数据'}
                  </View>
                </View>
              </View>
              <View className='flex'>
                <View className='flex-1'>
                  绩点：
                  <View className='inline text-primary font-bold text-lg'>
                    {data.detail.must_gpa ?? '无数据'}
                  </View>
                </View>
              </View>
            </DisplayCard>
            <DisplayCard title='核心课程成绩'>
              <View className='flex'>
                <View className='flex-1'>
                  算数平均排名：
                  <View className='inline text-primary font-bold text-lg'>
                    {getRank(data.detail.core_arithmetic_rank)}
                  </View>
                  {getRankTotal(data.detail.core_arithmetic_rank) && (
                    <>
                      <View className='inline text-primary font-bold text-xs'>
                        /{getRankTotal(data.detail.core_arithmetic_rank)}
                      </View>
                      <View className='inline ml-0.5'>
                        (前
                        {formatDecimal(
                          (Number(getRank(data.detail.core_arithmetic_rank)) /
                            Number(
                              getRankTotal(data.detail.core_arithmetic_rank)
                            )) *
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
                    {getRank(data.detail.core_weighted_rank)}
                  </View>
                  {getRankTotal(data.detail.core_weighted_rank) && (
                    <>
                      <View className='inline text-primary font-bold text-xs'>
                        /{getRankTotal(data.detail.core_weighted_rank)}
                      </View>
                      <View className='inline ml-0.5'>
                        (前
                        {formatDecimal(
                          (Number(getRank(data.detail.core_weighted_rank)) /
                            Number(
                              getRankTotal(data.detail.core_weighted_rank)
                            )) *
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
                    {getRank(data.detail.core_gpa_rank)}
                  </View>
                  {getRankTotal(data.detail.core_gpa_rank) && (
                    <>
                      <View className='inline text-primary font-bold text-xs'>
                        /{getRankTotal(data.detail.core_gpa_rank)}
                      </View>
                      <View className='inline ml-0.5'>
                        (前
                        {formatDecimal(
                          (Number(getRank(data.detail.core_gpa_rank)) /
                            Number(getRankTotal(data.detail.core_gpa_rank))) *
                            100
                        )}
                        %)
                      </View>
                    </>
                  )}
                </View>
              </View>
            </DisplayCard>
          </View>
          <View className='mt-auto pt-4'>
            <View className={styles.bottomInfo}>
              数据来源：可信电子凭证服务
            </View>
            <View className={styles.bottomInfo}>
              该项成绩主要用于：申请学生电子凭证相关业务
            </View>
          </View>
        </View>
      ) : (
        <NoData text='正在生成数据，请稍后刷新查看...' icon={NoDataIcon} />
      )}
    </PullRefresh>
  )
}

export default CaIndex
