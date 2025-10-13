import Taro from '@tarojs/taro'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { getFitness } from '@/apis/pt/fitness'
import { useAppSelector } from '@/utils/hooks/redux'
import type { Fitness } from '@/apis/pt/fitness'

const usePE = () => {
  const { enterYear, sex } = useAppSelector(state => state.userInfo)
  const { termYear } = useAppSelector(state => state.semester)
  const years = useMemo(() => {
    const temp: Array<number> = []
    for (let i = 0; enterYear + i <= termYear; ++i) {
      temp.unshift(enterYear + i)
    }
    return temp
  }, [enterYear, termYear])

  const [currentTabIndex, setCurrentTabIndex] = useState<number>(0)
  const [state, setState] = useState<(Fitness | null)[]>(
    new Array(years.length).fill(null)
  )

  const run = useCallback(async () => {
    await Taro.showLoading({
      mask: true,
      title: '加载中...',
    })
    try {
      // 发起请求
      const res = await getFitness(years[currentTabIndex]!)
      // 更新数据
      const newData = JSON.parse(JSON.stringify(state))
      // 处理引体向上/仰卧起坐
      const index = res.items.findIndex(
        item => item.name == '引体向上/仰卧起坐'
      )
      if (index != -1) {
        res.items[index]!.name = sex == '男' ? '引体向上' : '仰卧起坐'
      }
      // 设置数据
      newData[currentTabIndex] = res
      setState(newData)
    } catch (error) {
      await Taro.showToast({
        icon: 'none',
        title: error.toString(),
      })
    } finally {
      Taro.hideLoading()
    }
  }, [currentTabIndex, sex, state, years])

  useEffect(() => {
    if (state[currentTabIndex] === null) {
      void run()
    }
  }, [currentTabIndex, run, state])

  const refresh = async (close: () => void) => {
    try {
      await run()
    } catch (e) {
      console.log(e)
    }
    close()
  }

  return {
    currentTabIndex,
    setCurrentTabIndex,
    state,
    years,
    sex,
    refresh,
  }
}

export default usePE
