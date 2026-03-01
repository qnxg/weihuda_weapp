import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import dayjs from 'dayjs'
import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
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
import { useUserInfo } from '@/apis/userInfo'
import Card from '@/components/Card'
import PullRefresh from '@/components/PullRefresh'
import { offColor, offFontColor, onColors, onFontColors } from '@/utils/config'
import { rawWeekNum, tempWeekNum } from '@/utils/day'
import usePromise from '@/utils/hooks/usePromise'
import useRefreshKey from '@/utils/hooks/useRefreshKey'
import useShowCount from '@/utils/hooks/useShowCount'
import { fetchUserSettings } from '@/utils/storage/userSettings'
import type { CurDatesOfWeek, ClassTableItem } from './interface'
import type { SetStateAction } from 'react'

export interface Semester {
  show: string
  xn: number
  xq: number
}

/** 课表染色 */
function* colorized(rawData: CourseInfo[]) {
  let baseColorIndex = 0
  const colorMap: Map<string, number> = new Map()
  for (const courseItem of rawData) {
    let colorIndex: number
    if (colorMap.has(courseItem.courseName)) {
      colorIndex = colorMap.get(courseItem.courseName)!
    } else {
      colorIndex = baseColorIndex
      colorMap.set(courseItem.courseName, colorIndex)
      baseColorIndex++
      baseColorIndex %= onColors.length
    }
    yield {
      item: courseItem,
      bgColor: onColors[colorIndex] ?? onColors[0]!,
      fgColor: onFontColors[colorIndex] ?? onFontColors[0]!,
    }
  }
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

  const coloredClassTable = colorized(classTable).toArray()

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
        bgColor: coloredClassTable[i]!.bgColor,
        fgColor: coloredClassTable[i]!.fgColor,
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

type SemInfo = {
  tableSemesters: Semester[]
  tableSemIdx: number
  tableWeek: number
}
/**
 * 课表初始化信息
 */
function computeInitialSemState(
  currentTerm: number,
  currentSemYear: number,
  currentStart: string,
  userEnterYear: number
): SemInfo {
  const termText: Array<string> = ['秋', '春', '夏']

  // 计算学期
  const semesters: Array<Semester> = []
  // TODO 这里先进行特判，到了第三学期就先人为添加一个新学期，
  // 确保能够查看新课表。后续打算大力修改前端
  if (currentTerm === 3) {
    semesters.unshift({
      show: `${currentSemYear + 1}-${currentSemYear + 2}秋`,
      xn: currentSemYear + 1,
      xq: 1,
    })
  }
  // 从当前学年开始倒序枚举到入学年份。有可能入学年份大于当前学年（新生），
  // 此时下界取 min，确保当前学年被加入
  for (
    let i = currentSemYear;
    i >= Math.min(userEnterYear, currentSemYear);
    --i
  ) {
    for (let j = 3; j >= 1; --j) {
      semesters.push({
        show: `${i}-${i + 1}${termText[j - 1]}`,
        xn: i,
        xq: j,
      })
    }
  }
  // 生成基础信息
  const res = {
    tableSemesters: semesters,
    tableSemIdx: semesters.findIndex(
      item => item.xn == currentSemYear && item.xq == currentTerm
    ),
    tableWeek: tempWeekNum(currentStart),
  }
  return res
}

const Index: React.FC = () => {
  const [refreshKey, refreshTrigger] = useRefreshKey()

  // 其他页面的操作（如添加课程、修改设置）可能需要影响本页面，
  // 因此在本页面show的时候触发某些数据的刷新
  const pageShowTimes = useShowCount()

  const [userInfo, , , userInfoErr] = useUserInfo([])
  const [currentSemInfo, , , currentSemInfoErr] = useCurrentSemesterInfo([])
  const semStateInit = useMemo(() => {
    if (userInfo === undefined || currentSemInfo === undefined) {
      return undefined
    }

    return computeInitialSemState(
      currentSemInfo.term,
      currentSemInfo.year,
      currentSemInfo.startDate,
      userInfo.enter
    )
  }, [currentSemInfo, userInfo])

  const semStateSetByUser = useRef(false)
  const [{ tableSemIdx, tableSemesters, tableWeek }, internalSetSemState] =
    useState<Partial<SemInfo>>({})
  const wrappedSetSemState = useCallback(
    (f: SetStateAction<Partial<SemInfo>>) => {
      internalSetSemState(f)
      semStateSetByUser.current = true
    },
    []
  )
  useEffect(() => {
    if (semStateSetByUser.current || semStateInit === undefined) {
      return
    }
    internalSetSemState(semStateInit)
  }, [semStateInit])
  type S = React.Dispatch<React.SetStateAction<number | undefined>>
  const setTableSemIdx: S = n =>
    wrappedSetSemState(old => ({
      ...old,
      tableSemIdx: typeof n === 'function' ? n(old.tableSemIdx) : n,
    }))
  const setTableWeek: S = n =>
    wrappedSetSemState(old => ({
      ...old,
      tableWeek: typeof n === 'function' ? n(old.tableWeek) : n,
    }))

  const [tableXn, tableXq] = useMemo(() => {
    if (tableSemesters === undefined || tableSemIdx === undefined) {
      return [undefined, undefined]
    }
    return [
      String(tableSemesters[tableSemIdx]!.xn),
      String(tableSemesters[tableSemIdx]!.xq),
    ] as const
  }, [tableSemIdx, tableSemesters])

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
    if (tableStart === undefined || tableWeek == undefined) {
      return undefined
    }
    if (tableWeek !== 0 /* TODO: why? */) {
      const daysArrayTemp: Array<CurDatesOfWeek> = []
      const curWeek = tableWeek < 0 ? tableWeek + 1 : tableWeek - 1
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
  }, [tableWeek, tableStart])

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
    if (
      !tableSemesters ||
      tableSemesters.length === 0 ||
      !tableSemIdx ||
      !tableSemesters[tableSemIdx]
    ) {
      return
    }
    await Taro.showLoading({
      mask: true,
      title: '加载中...',
    })
    try {
      const res = await getExtraCourseApi(
        tableSemesters[tableSemIdx].xn,
        tableSemesters[tableSemIdx].xq
      )
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

  const onRefresh = async (close: () => void) => {
    refreshTrigger()
    close()
  }

  const formattedTable = useMemo(
    () =>
      (classTable &&
        tableWeek !== undefined &&
        formatTable(
          settings?.needDisplayNotCurrentWeekClasses === true,
          classTable,
          tableWeek
        )) ||
      [],
    [classTable, settings?.needDisplayNotCurrentWeekClasses, tableWeek]
  )

  const title1 = () => {
    if (
      tableSemesters === undefined ||
      tableSemIdx == undefined ||
      tableWeek == undefined
    ) {
      return userInfoErr !== null || currentSemInfoErr !== null ? (
        <Text>课表学期信息初始化失败</Text>
      ) : (
        <Text>正在获取学期信息…</Text> // 若学期信息已被请求过，直接显示
      )
    }

    const semShow = tableSemesters[tableSemIdx]?.show
    if (semShow === undefined) {
      throw new Error('semesters下标越界，这是一个bug')
    }

    const semWeekShow =
      tableWeek >= 0
        ? `${semShow}    第${tableWeek}周`
        : `${semShow}    距离开学还有${-tableWeek}周` // TODO: dead?

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
        semesters={tableSemesters}
        tableCurrentDatesOfWeek={curDatesOfWeek}
        tableCurrentWeek={tableWeek}
        tableCurrentSemIdx={tableSemIdx}
        setShouldShowOptions={setShouldShowOptions}
        xn={currentSemInfo?.year}
        xq={currentSemInfo?.term}
        rawWeekNum={
          currentSemInfo ? rawWeekNum(currentSemInfo?.startDate) : undefined
        }
      />
      <ExtraCourse
        open={showExtraCoursePopup}
        onClose={() => setShowExtraCoursePopup(false)}
        data={extraCourseData}
      />
      <PullRefresh runFunc={onRefresh} topGap={124}>
        <TableBody
          formattedTable={formattedTable}
          tableCurrentWeek={tableWeek}
          setTableCurrentWeek={setTableWeek}
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
        tableCurrentWeek={tableWeek}
        setTableCurrentWeek={setTableWeek}
        tableCurrentSemIdx={tableSemIdx}
        setTableCurrentSem={setTableSemIdx}
        semesters={tableSemesters}
      />
      <ClassDetailFloat
        classDetailsToShow={classDetailsForFloatComponentToShow}
        clearClassDetailsToShow={clearClassDetailsForFloatComponentToShow}
        refreshTable={refreshTrigger}
      />
      {tableSemesters &&
        tableSemIdx !== undefined &&
        tableSemesters[tableSemIdx] && (
          <AddCourseButton
            xn={tableSemesters[tableSemIdx].xn}
            xq={tableSemesters[tableSemIdx].xq}
          />
        )}
    </Fragment>
  )
}
export default Index
