import { View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import GradeCard from '../gradeCard'
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
            <GradeCard
              title='全部课程'
              grade={{
                arithmetic: data.detail.all_arithmetic,
                weighted: data.detail.all_weighted,
                gpa: data.detail.all_gpa,
              }}
              rank={{
                arithmetic: data.detail.all_arithmetic_rank,
                weighted: data.detail.all_weighted_rank,
                gpa: data.detail.all_gpa_rank,
              }}
            />
            <GradeCard
              title='必修课程'
              grade={{
                arithmetic: data.detail.must_arithmetic,
                weighted: data.detail.must_weighted,
                gpa: data.detail.must_gpa,
              }}
            />
            <GradeCard
              title='核心课程'
              rank={{
                arithmetic: data.detail.core_arithmetic_rank,
                weighted: data.detail.core_weighted_rank,
                gpa: data.detail.core_gpa_rank,
              }}
            />
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
