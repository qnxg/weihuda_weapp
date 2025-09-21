import Taro from '@tarojs/taro'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { getFitness } from '@/apis/pt/fitness'
import { useAppSelector } from '@/utils/hooks/redux'
import type { Fitness } from '@/apis/pt/fitness'

const init = {
  student: {
    name: '加载中',
    number: '',
  },
  total: {
    grade: '不及格',
    score: 0,
  },
  eye: {
    eye_ametropia_left: '加载中',
    eye_ametropia_right: '加载中',
    eye_mirror_left: '加载中',
    eye_mirror_right: '加载中',
    eyesight_left: '加载中',
    eyesight_right: '加载中',
  },
  items: [],
}

const initState = (length: number): Fitness[] => {
  const temp: Fitness[] = []
  for (let i = 0; i < length; ++i) {
    temp.push(init)
  }
  return temp
}

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

  const [current, setCurrent] = useState<number>(0)
  const [state, setState] = useState<Fitness[]>(initState(years.length))

  const run = useCallback(async () => {
    await Taro.showLoading({
      mask: true,
      title: '加载中...',
    })
    try {
      // 发起请求
      const res = await getFitness(years[current]!)
      // 更新数据
      const newData = JSON.parse(JSON.stringify(state))
      // 处理引体向上/仰卧起坐
      const index = res.items.findIndex(
        item => item.name == '引体向上/仰卧起坐'
      )
      res.items[index]!.name = sex == '男' ? '引体向上' : '仰卧起坐'
      // 设置数据
      newData[current] = res
      setState(newData)
    } catch (error) {
      await Taro.showToast({
        icon: 'none',
        title: error.toString(),
      })
    } finally {
      Taro.hideLoading()
    }
  }, [current, sex, state, years])

  useEffect(() => {
    if (JSON.stringify(state[current]) === JSON.stringify(init)) {
      void run()
    }
  }, [current, run, state])

  const refresh = async (close: () => void) => {
    try {
      await run()
    } catch (e) {
      console.log(e)
    }
    close()
  }

  return {
    current,
    setCurrent,
    state,
    years,
    sex,
    refresh,
  }
}

export default usePE
