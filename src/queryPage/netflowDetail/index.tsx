import { Picker, Text, View } from '@tarojs/components'
import Taro, { usePullDownRefresh } from '@tarojs/taro'
import dayjs from 'dayjs'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { month2020, monthAll } from './config'
import styles from './index.module.scss'
import { getNetflowDay, getNetflowMonth } from '@/apis/netflow'
import DisplayCard from '@/components/DisplayCard'
import TabBar from '@/components/TabBar'
import icon from '@/static/mine/icon-sjjxbind.svg'
import type { LineData, SelectorItem } from './interface'
import type { NetflowDetail } from '@/apis/netflow'

const tabs = ['按月查询', '按天查询']

const fmtFlow = (num: number | undefined): string => {
  if (!num) {
    return '0.00K'
  }
  if (num >= 1048576) {
    return `${(num / 1048576).toFixed(2)}G`
  }
  if (num >= 1024) {
    return `${(num / 1024).toFixed(2)}M`
  }
  return `${num.toFixed(2)}K`
}

const getTodayDate = () => {
  const today = new Date()
  return {
    year: today.getFullYear(),
    month: today.getMonth() + 1,
    day: today.getDate(),
  }
}

const fmt2width = (num: number): string => num.toString().padStart(2, '0')

const Index: React.FC = () => {
  const todayDate = getTodayDate()
  const [isDay, setIsDay] = useState<number>(0)
  const [byMonth, setByMonth] = useState([todayDate.year, todayDate.month])
  const [byDay, setByDay] = useState([
    todayDate.year,
    todayDate.month,
    todayDate.day,
  ])
  const [sltByMonth, setSltByMonth] = useState({
    year: 0,
    month: todayDate.month - 1,
  })
  const [sltByDay, setSltByDay] = useState({
    year: 0,
    month: todayDate.month - 1,
    day: todayDate.day - 1,
  })

  const yearSltData = useMemo<SelectorItem[]>(() => {
    return new Array(todayDate.year - 2019)
      .fill(todayDate.year)
      .map((item, index) => ({
        name: `${item - index}年`,
        value: item - index,
      }))
  }, [todayDate.year])

  const monthSltData = useMemo<SelectorItem[]>(
    () => (yearSltData[sltByMonth.year].value < 2021 ? month2020 : monthAll),
    [sltByMonth.year, yearSltData]
  )

  const monthByDaySltData = useMemo<SelectorItem[]>(
    () => (yearSltData[sltByDay.year].value < 2021 ? month2020 : monthAll),
    [sltByDay.year, yearSltData]
  )

  const daySltData = useMemo<SelectorItem[]>(() => {
    const length = dayjs(
      `${todayDate.year - sltByDay.year}-${fmt2width(sltByDay.month + 1)}-01`
    ).daysInMonth()
    return new Array(length).fill(0).map((_, index) => {
      return {
        name: `${index + 1}日`,
        value: index + 1,
      }
    })
  }, [sltByDay.month, sltByDay.year, todayDate.year])

  const [data, setData] = useState<NetflowDetail | null>(null)

  /**
   * 获取数据
   */
  const getData = useCallback(async () => {
    await Taro.showLoading({
      mask: true,
      title: '加载中...',
    })
    try {
      let year = byMonth[0]
      let month = byMonth[1]
      let res: NetflowDetail | null = null
      if (!isDay) {
        res = await getNetflowMonth(year, month)
      } else {
        year = byDay[0]
        month = byDay[1]
        const day = byDay[2]
        res = await getNetflowDay(year, month, day)
      }

      if (res) {
        setData(res)
      }
    } catch (err) {
      await Taro.showToast({
        icon: 'none',
        title: err.toString(),
      })
    } finally {
      Taro.hideLoading()
    }
  }, [byDay, byMonth, isDay])

  useEffect(() => {
    void getData()
  }, [isDay, byDay, byMonth, getData])

  // const { data, run, loading } = useGraphql<MonthDetailObject>({
  //   query: `query monthDetail($year: Int!, $month: Int!${isDay ? ', $day: Int!' : ''}) {
  //     netflow {
  //       ${isDay ? 'dayDetail' : 'monthDetail'}(year: $year, month: $month${isDay ? ', day: $day' : ''}) {
  //         AllDownload
  //         FloatDetailList { App Download }
  //       }
  //     }
  //   }`,
  //   variables: {
  //     year: isDay ? byDay[0] : byMonth[0],
  //     month: isDay ? byDay[1] : byMonth[1],
  //     day: byDay[2]
  //   }
  // });

  // useEffect(() => {
  //   if (loading) {
  //     Taro.showLoading({
  //       mask: true,
  //       title: '加载中...'
  //     });
  //   } else {
  //     Taro.hideLoading();
  //   }
  // }, [loading]);

  usePullDownRefresh(async () => {
    await getData()
    Taro.stopPullDownRefresh()
  })

  const dataList: LineData[] | undefined = useMemo(() => {
    const list = data?.FloatDetailList
    return list?.map(item => {
      let c1 = ''
      let c2 = ''
      if (item.App[0] === '/') {
        const catStr = item.App.slice(1)
        const slash = catStr.indexOf('/')
        if (slash > -1) {
          c1 = catStr.slice(slash + 1)
          c2 = catStr.slice(0, slash)
        } else {
          c1 = catStr
          c2 = c1
        }
      }
      return {
        c1,
        c2,
        data: fmtFlow(item.Download),
      }
    })
  }, [data])

  return (
    <View className={styles.container}>
      <TabBar
        items={tabs}
        num={0}
        onClick={i => {
          const duration = 300 + (dataList?.length || 0)
          setIsDay(i)
          void Taro.pageScrollTo({
            scrollTop: 0,
            duration: duration > 1000 ? 1000 : duration,
          })
        }}
        current={isDay}
      />
      <DisplayCard title={isDay ? '选择日期' : '选择月份'} icon={icon}>
        {isDay ? (
          <Picker
            className={styles.selector}
            mode='multiSelector'
            range={[yearSltData, monthByDaySltData, daySltData]}
            rangeKey='name'
            value={[sltByDay.year, sltByDay.month, sltByDay.day]}
            onColumnChange={e => {
              if (e.detail.column === 0) {
                setSltByDay({
                  year: e.detail.value,
                  month: 0,
                  day: 0,
                })
                return
              }
              if (e.detail.column === 1) {
                setSltByDay(prevState => ({
                  ...prevState,
                  month: e.detail.value,
                  day: 0,
                }))
                return
              }
            }}
            onChange={value => {
              const [yi, mi, di] = value.detail.value
              setSltByDay({ year: yi, month: mi, day: di })
              setByDay([
                yearSltData[yi].value,
                monthByDaySltData[mi].value,
                daySltData[di].value,
              ])
            }}
          >
            {`${byDay[0]}年-${fmt2width(byDay[1])}月-${fmt2width(byDay[2])}日`}
          </Picker>
        ) : (
          <Picker
            className={styles.selector}
            mode='multiSelector'
            range={[yearSltData, monthSltData]}
            rangeKey='name'
            value={[sltByMonth.year, sltByMonth.month]}
            onColumnChange={e => {
              if (e.detail.column === 0) {
                setSltByMonth({
                  year: e.detail.value,
                  month: 0,
                })
              }
            }}
            onChange={value => {
              const [yi, mi] = value.detail.value
              setSltByMonth({ year: yi, month: mi })
              setByMonth([yearSltData[yi].value, monthSltData[mi].value])
            }}
          >
            {`${byMonth[0]}年-${fmt2width(byMonth[1])}月`}
          </Picker>
        )}
      </DisplayCard>
      <View className={styles.tip}>以下数据均来源于校园网流量系统</View>
      <DisplayCard>
        <View className={styles.title}>
          <View>
            <Text className={styles.num}>{dataList?.length || 0}</Text>
            <Text>个项目</Text>
          </View>
          <View
            className={styles.all}
          >{`总量：${fmtFlow(data?.AllDownload)}`}</View>
        </View>
        {dataList?.map(item => {
          return (
            <View key={item.c1 + item.data} className={styles.content}>
              <View className={styles.left}>
                <View className={styles.c1}>{item.c1}</View>
                <View className={styles.c2}>{item.c2}</View>
              </View>
              <View className={styles.right}>{item.data}</View>
            </View>
          )
        })}
      </DisplayCard>
    </View>
  )
}
export default Index
