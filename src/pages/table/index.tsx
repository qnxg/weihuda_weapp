import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import dayjs from 'dayjs'
import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import AddCourseButton from './components/AddCourseButton'
import ClassDetailFloat from './components/ClassDetailFloat'
import ExtraCourse from './components/ExtraCourse'
import Header from './components/Header'
import Options from './components/Options'
import TableBody from './components/TableBody'
import style from './index.module.scss'
import {
  getExtraCourseApi,
  useCourse,
  type CourseInfo,
  type ExtraCourseInfo,
} from '@/apis/hdjw/classTable'
import { useClassStartDate, useCurrentSemesterInfo } from '@/apis/semester'
import Card from '@/components/Card'
import PullRefresh from '@/components/PullRefresh'
import { offColor, offFontColor, onColors, onFontColors } from '@/utils/config'
import { getXnXqShowName, rawWeekNum } from '@/utils/day'
import usePromise from '@/utils/hooks/usePromise'
import useRefreshKey from '@/utils/hooks/useRefreshKey'
import useShowCount from '@/utils/hooks/useShowCount'
import { fetchUserSettings } from '@/utils/storage/userSettings'
import type { CurDatesOfWeek, ClassTableItem } from './interface'

/** @see https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/Remainder */
function modPositive(n: number, d: number) {
  d = Math.abs(d)
  return ((n % d) + d) % d
}

type ColorPair = { readonly bgColor: string; readonly fgColor: string }
/**
 * @returns 每个课程项目对应的颜色。需要和传入数组一一对应
 */
function tableColors(rawData: readonly CourseInfo[]): readonly ColorPair[] {
  /**
   * 唯一标识一个课程的键
   *
   * 定义课程的同一性
   */
  const courseKey = (course: CourseInfo): string =>
    [course.courseName, course.courseId, course.customizeId]
      .map(v => (v === undefined ? '' : JSON.stringify(v)))
      .join()

  const isCustomCourse = (course: CourseInfo): boolean =>
    course.customizeId !== -1

  const maxColorNum = Math.min(onColors.length, onFontColors.length)
  const modularColor = (int: number): ColorPair => ({
    fgColor: onFontColors[modPositive(int, maxColorNum)]!,
    bgColor: onColors[modPositive(int, maxColorNum)]!,
  })

  const keys = rawData.map(courseKey)
  const customCourseKeys = new Set(
    rawData.filter(isCustomCourse).map(courseKey)
  )
  const sortedKeys = keys.toSorted()

  const keyToColorMap = new Map<string, ColorPair>()
  let counter = 0
  const useExistingOrDyeAndRotate = (key: string) => {
    if (!keyToColorMap.has(key)) {
      keyToColorMap.set(key, modularColor(counter))
      counter += 1
    }
  }
  sortedKeys
    .filter(k => !customCourseKeys.has(k))
    .forEach(useExistingOrDyeAndRotate)
  sortedKeys
    .filter(k => customCourseKeys.has(k))
    .forEach(useExistingOrDyeAndRotate)

  return rawData.map(c => keyToColorMap.get(courseKey(c))!)
}

/**
 * 格式化课表，我们会处理得到一个 Array<Array<ClassTableItem>> 类型的格式化之后的课表
 *
 * 数组下标的含义为 formatTable[周几][第几节课]
 */
function formatTable(
  needNotCurrentWeekClasses: boolean,
  classTable: CourseInfo[],
  tableCurrentWeek: number
): Array<Array<ClassTableItem>> {
  if (!classTable) {
    return []
  }

  /**
   * 和课表数组一一对应
   */
  const colors = tableColors(classTable)

  const schedule: Array<Array<ClassTableItem>> = []
  // 初始化数组
  for (let i = 0; i < 7; i++) {
    const temp: Array<ClassTableItem> = []
    for (let j = 0; j < 12; j++) {
      temp.push({ courses: [], len: 1, merged: false })
    }
    schedule.push(temp)
  }
  // 格式化 Table
  for (let i = 0; i < classTable.length; i++) {
    const course = Object.assign({}, classTable[i]) // classTable 是只读的，需要先复制一下
    const time = course.time - 1 // 因为 time 是从 1 开始的，而我们数组是从 0 开始的
    course.time = -1 // 为了便于后续合并格子，这里全都改成 -1
    course.day = course.day === 7 ? 0 : course.day
    // 计算是否为本周课程
    if (course.weeks.includes(tableCurrentWeek)) {
      // 是本周的课则放在前面，否则放在后面。这样可以保证本周课程在前面显示
      schedule[course.day]![time]!.courses.unshift({
        courseItem: course,
        bgColor: colors[i]!.bgColor,
        fgColor: colors[i]!.fgColor,
      })
    } else if (needNotCurrentWeekClasses) {
      // 没有开启仅显示本周课程
      schedule[course.day]![time]!.courses.push({
        courseItem: course,
        bgColor: offColor,
        fgColor: offFontColor,
      })
    }
  }
  // 把可以合并的格子都给合并，向上合并
  for (let i = 0; i < 7; ++i) {
    let lastPos = 0
    for (let j = 1; j < 12; ++j) {
      // 判断两个格子是否是本质相同的
      const now = schedule[i]![j]!
      const last = schedule[i]![lastPos]!
      let flag = true
      if (
        now.courses.length > 0 &&
        now.courses.length === last.courses.length
      ) {
        // 进行这么复杂比较的原因是可能 courses 的顺序不同
        const tmp: { [index: string]: number } = {}
        for (const item of now.courses) {
          tmp[JSON.stringify(item)] = 1
        }
        for (const item of last.courses) {
          if (tmp[JSON.stringify(item)] === undefined) {
            flag = false
            break
          }
        }
      } else {
        flag = false
      }
      if (flag) {
        schedule[i]![j]!.courses = [] // 清空当前格子，就不会再显示了
        schedule[i]![j]!.merged = true // 标记为被合并
        schedule[i]![lastPos]!.len = last.len + 1
      } else {
        lastPos = j
      }
    }
  }
  return schedule
}

const fetchSettings = async () =>
  (await fetchUserSettings()).classtablePageSettings

const Index: React.FC = () => {
  const [refreshKey, refreshTrigger] = useRefreshKey()

  // 其他页面的操作（如添加课程、修改设置）可能需要影响本页面，
  // 因此在本页面show的时候触发某些数据的刷新
  const pageShowTimes = useShowCount()

  const [currentSemInfo, , , currentSemInfoErr] = useCurrentSemesterInfo([
    refreshKey,
  ])

  const [tableXn, setTableXn] = useState<string>()
  const [tableXq, setTableXq] = useState<string>()
  const [tableWeekNotRaw, setTableWeekNotRawInternal] = useState<number>(0)
  const isTableWeekSetByUser = useRef(false)
  const setTableWeekNotRawWrapped = (w: number) => {
    isTableWeekSetByUser.current = true
    setTableWeekNotRawInternal(w)
  }

  useEffect(() => {
    if (
      currentSemInfo !== undefined &&
      (tableXn === undefined || tableXq === undefined)
    ) {
      setTableXn(currentSemInfo.year.toString())
      setTableXq(currentSemInfo.term.toString())
      if (isTableWeekSetByUser.current) {
        return
      }
      setTableWeekNotRawInternal(
        Math.min(18, rawWeekNum(currentSemInfo.startDate) + 1)
      )
    }
  }, [currentSemInfo, tableXn, tableXq])

  const [
    classTable,
    loadingClassTableCache,
    loadingClassTableFetch,
    classTableErr,
  ] = useCourse(tableXn, tableXq, [refreshKey, pageShowTimes])

  const [
    tableStart,
    loadingTableStartCache,
    loadingTableStartFetch,
    tableStartErr,
  ] = useClassStartDate(tableXn, tableXq, [refreshKey, pageShowTimes])

  // 计算当前选定周的日期
  const curDatesOfWeek = useMemo<Array<CurDatesOfWeek> | undefined>(() => {
    if (tableStart === undefined || tableWeekNotRaw == undefined) {
      return undefined
    }
    if (tableWeekNotRaw !== 0 /* TODO: why? */) {
      const daysArrayTemp: Array<CurDatesOfWeek> = []
      const curWeek =
        tableWeekNotRaw < 0 ? tableWeekNotRaw + 1 : tableWeekNotRaw - 1
      const startDate = dayjs(tableStart).add(curWeek, 'week')
      for (let i = 0; i < 7; ++i) {
        const temp = startDate.add(i, 'day')
        daysArrayTemp.push({
          month: temp.month() + 1,
          day: temp.date(),
        })
      }
      return daysArrayTemp
    } else {
      return undefined
    }
  }, [tableWeekNotRaw, tableStart])

  const [
    classDetailsForFloatComponentToShow,
    setClassDetailsForFloatComponentToShow,
  ] = useState<
    {
      courseItem: CourseInfo
      bgColor: string
      fgColor: string
    }[]
  >([])
  const clearClassDetailsForFloatComponentToShow = () =>
    setClassDetailsForFloatComponentToShow([])

  const [shouldShowOptions, setShouldShowOptions] = useState(false)

  const [settings, loadingSettings, settingErr] = usePromise(
    fetchSettings,
    undefined,
    [fetchSettings, pageShowTimes, refreshKey]
  )

  // 无课表课程
  const [showExtraCoursePopup, setShowExtraCoursePopup] = useState(false)
  const [extraCourseData, setExtraCourseData] = useState<ExtraCourseInfo[]>([])
  const handleShowExtraCourse = async () => {
    if (tableXn === undefined || tableXq === undefined) {
      return
    }
    await Taro.showLoading({
      mask: true,
      title: '加载中...',
    })
    try {
      const res = await getExtraCourseApi(tableXn, tableXq)
      setExtraCourseData(res)
      setShowExtraCoursePopup(true)
    } catch (err) {
      await Taro.showToast({
        icon: 'none',
        title: err.toString(),
      })
    } finally {
      Taro.hideLoading()
    }
  }

  const currentXn = currentSemInfo ? currentSemInfo.year.toString() : undefined
  const currentXq = currentSemInfo ? currentSemInfo.term.toString() : undefined

  const onRefresh = async (close: () => void) => {
    refreshTrigger()
    close()
  }

  const formattedTable = useMemo(
    () =>
      (classTable &&
        tableWeekNotRaw !== undefined &&
        formatTable(
          settings?.needDisplayNotCurrentWeekClasses === true,
          classTable,
          tableWeekNotRaw
        )) ||
      [],
    [classTable, settings?.needDisplayNotCurrentWeekClasses, tableWeekNotRaw]
  )

  const title1 = () => {
    if (
      tableXn === undefined ||
      tableXq === undefined ||
      tableWeekNotRaw == undefined
    ) {
      return currentSemInfoErr !== null ? (
        <Text>课表学期信息初始化失败</Text>
      ) : (
        <Text>正在获取学期信息…</Text> // 若学期信息已被请求过，直接显示
      )
    }

    const semShow = getXnXqShowName(+tableXn, +tableXq)
    const semWeekShow = `${semShow} 第${tableWeekNotRaw}周`

    const dataStatus = () => {
      if (
        loadingClassTableCache ||
        loadingClassTableFetch ||
        loadingSettings ||
        loadingTableStartCache ||
        loadingTableStartFetch
      ) {
        return '（同步中）'
      }
      if (classTableErr) {
        return '（同步失败）'
      }
      if (tableStartErr) {
        return '（日期获取失败）'
      }
      if (settingErr) {
        return '（设置获取失败）'
      }
      return ''
    }

    return (
      <Text>
        {semWeekShow}
        {dataStatus() satisfies string}
      </Text>
    )
  }

  return (
    <Fragment>
      <Header
        title1={title1()}
        tableDatesOfWeek={curDatesOfWeek}
        tableWeek={tableWeekNotRaw}
        setShouldShowOptions={setShouldShowOptions}
        currentXn={currentXn}
        currentXq={currentXq}
        currentRawWeekNum={
          currentSemInfo ? rawWeekNum(currentSemInfo?.startDate) : undefined
        }
        tableXn={tableXn ? +tableXn : undefined}
        tableXq={tableXq ? +tableXq : undefined}
      />
      <ExtraCourse
        open={showExtraCoursePopup}
        onClose={() => setShowExtraCoursePopup(false)}
        data={extraCourseData}
      />
      <PullRefresh runFunc={onRefresh} topGap={124}>
        <TableBody
          formattedTable={formattedTable}
          tableWeekNotRaw={tableWeekNotRaw}
          setTableWeekNotRaw={setTableWeekNotRawWrapped}
          onRefresh={onRefresh}
          setClassDetailsForFloatComponentToShow={
            setClassDetailsForFloatComponentToShow
          }
        />
        <View className={style.extraCourseCard}>
          <Card onClick={handleShowExtraCourse}>
            <View className={style.extraCourseContainer}>
              <Text className={style.extraCourseText}>查看无课表课程</Text>
            </View>
          </Card>
        </View>
      </PullRefresh>
      <Options
        show={shouldShowOptions}
        setShow={setShouldShowOptions}
        tableWeek={tableWeekNotRaw}
        setTableWeek={setTableWeekNotRawWrapped}
        setTableXn={setTableXn}
        setTableXq={setTableXq}
        tableXn={tableXn}
        tableXq={tableXq}
        currentXn={currentXn}
        currentXq={currentXq}
        currentSemStartDate={currentSemInfo?.startDate}
        refreshTableSettingsTrigger={refreshTrigger}
        refreshKey={refreshKey}
      />
      <ClassDetailFloat
        classDetailsToShow={classDetailsForFloatComponentToShow}
        clearClassDetailsToShow={clearClassDetailsForFloatComponentToShow}
        refreshTable={refreshTrigger}
      />
      {tableXn && tableXq && <AddCourseButton xn={+tableXn} xq={+tableXq} />}
    </Fragment>
  )
}
export default Index
