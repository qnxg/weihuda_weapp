import { Navigator } from '@tarojs/components'
import Taro from '@tarojs/taro'
import React, { useCallback, useEffect, useState } from 'react'
import Card from './components/Card'
import HalfCard from './components/HalfCard'
import { getFitnessApi, type Fitness } from '@/apis/pt/fitness'
import { getCurrentXnXq } from '@/apis/semester'
import { getUserInfoApi } from '@/apis/userInfo'
import NoData from '@/components/NoData'
import PullRefresh from '@/components/PullRefresh'
import Tab from '@/components/Tab'
import usePromise from '@/utils/hooks/usePromise'

// 把对象用&连接起来
const obj2query = (obj: any): string => {
  let res = ''
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      res += `${key}=${obj[key]}&`
    }
  }
  return res.slice(0, -1)
}

const getAvailableYears = async (): Promise<number[]> => {
  const enterYear = (await getUserInfoApi()).enter
  const [currentXn] = await getCurrentXnXq()

  const res: Array<number> = []
  for (let i = 0; enterYear + i <= currentXn; ++i) {
    res.unshift(enterYear + i)
  }
  return res
}

const Index: React.FC = () => {
  const [years] = usePromise(getAvailableYears, [], [getAvailableYears])

  const [currentTabIndex, setCurrentTabIndex] = useState<number | null>(null)
  useEffect(() => {
    setCurrentTabIndex(old => {
      if (old === null && years.length !== 0) {
        return 0
      } else {
        return old
      }
    })
  }, [years.length])

  const [tabData, setTabData] = useState<(Fitness | null)[]>(
    new Array(years.length).fill(null)
  )
  useEffect(() => {
    setTabData(new Array(years.length).fill(null))
  }, [years])

  const run = useCallback(async () => {
    if (currentTabIndex === null) {
      return
    }
    await Taro.showLoading({
      mask: true,
      title: '加载中...',
    })
    try {
      // 发起请求
      const res = await getFitnessApi(years[currentTabIndex]!)
      // 更新数据
      const newData = [...tabData]
      // 设置数据
      newData[currentTabIndex] = res
      setTabData(newData)
    } catch (error) {
      await Taro.showToast({
        icon: 'none',
        title: error.toString(),
      })
    } finally {
      Taro.hideLoading()
    }
  }, [currentTabIndex, tabData, years])

  useEffect(() => {
    if (currentTabIndex === null) {
      return
    }
    if (tabData[currentTabIndex] === null) {
      void run()
    }
  }, [currentTabIndex, run, tabData])

  const refresh = async (close: () => void) => {
    try {
      await run()
    } catch (e) {
      console.log(e)
    }
    close()
  }

  const onChangeTab = (index: number): void => {
    setCurrentTabIndex(index)
  }

  const tabItems = tabData.map((item, index) => ({
    key: years[index]!,
    label: years[index],
    body: (
      <PullRefresh runFunc={refresh} topGap={68}>
        {item === null ? (
          <NoData text='暂无体测数据' />
        ) : (
          <>
            <Card data={item} />
            {item.items &&
              item.items.map(project => {
                return (
                  <HalfCard
                    key={project.name}
                    name={project.name}
                    color={project.class}
                    rank={project.rank}
                    score={project.score}
                  />
                )
              })}
            <Navigator
              url={`/queryPage/PEQuery/eye?${obj2query(tabData[0]?.eye)}`}
            >
              <HalfCard name='视力' color='white' rank='' score='点击查看' />
            </Navigator>
          </>
        )}
      </PullRefresh>
    ),
  }))

  return (
    <Tab current={currentTabIndex} onChange={onChangeTab} items={tabItems} />
  )
}

export default Index
