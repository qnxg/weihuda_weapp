import Taro from '@tarojs/taro'
import { useMemo, useState } from 'react'
import { postCourseApi } from '@/apis/hdjw/classTable'

const useAddCourse = (xn: number, xq: number) => {
  /**
   * classname 课程名称
   * location 上课地点
   * teachers 上课教师
   * week 上课周次
   * mode 全选状态
   * picker picker选择
   */
  const [state, setState] = useState({
    classname: '',
    location: '',
    teachers: '',
    week: Array(16).fill(false),
    mode: true,
    picker: Array(3).fill(0),
  })

  const formatValue = useMemo(() => {
    const { week, picker } = state
    // 格式化week
    const tempWeek: number[] = []
    week.map((item, index) => {
      if (item) {
        tempWeek.push(index + 1)
      }
    })
    const stringWeek = tempWeek.join(',')
    // 格式化section
    const section: number[] = []
    for (let i = picker[1]; i <= picker[2]; ++i) {
      section.push(i + 1)
    }
    const stringSection = section.join(',')
    return {
      week: stringWeek,
      section: stringSection,
    }
  }, [state])

  const run = async () => {
    const data = {
      classname: state.classname,
      location: state.location,
      teachers: state.teachers,
      week: formatValue.week,
      section: formatValue.section,
      day: String(state.picker[0] === 0 ? 7 : state.picker[0]),
      xn: xn,
      xq: xq,
    }

    await Taro.showLoading({
      title: 'loading...',
      mask: true,
    })

    try {
      // 发起请求
      await postCourseApi(data)
      await Taro.showToast({
        title: '添加成功',
        duration: 1500,
      })
      setTimeout(() => {
        void Taro.navigateBack()
      }, 1500)
    } catch (error) {
      await Taro.showToast({
        icon: 'none',
        title: error.toString(),
      })
    }

    Taro.hideLoading()
  }

  return {
    state,
    setState,
    formatValue,
    run,
  }
}

export default useAddCourse
