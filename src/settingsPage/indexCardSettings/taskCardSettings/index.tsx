import { useCallback } from 'react'
import LineDividedSwitchList from '@/components/LineDividedSwitchList'
import usePromise from '@/utils/hooks/usePromise'
import useShouldRelaunchIndex from '@/utils/hooks/useShouldRelaunchIndex'
import { fetchUserSettings } from '@/utils/storage/userSettings'
import {
  setShowCustomExamArrange,
  setShowExamArrange,
  setShowExperimentArrange,
} from '@/utils/storage/userSettings/customAccessors/TaskCardSettings'
import type { SwitchChangeEvent } from '@/components/AsyncSwitch'

const getTaskCardSettings = async () =>
  (await fetchUserSettings()).indexTaskCardSettings

const SwitchList: React.FC<{
  setShouldRelaunchIndex: (s: boolean) => unknown
}> = ({ setShouldRelaunchIndex }) => {
  const [taskCardSettings, loadingTaskCardSettings] = usePromise(
    getTaskCardSettings,
    undefined,
    [getTaskCardSettings]
  )

  const onShowExperimentArrangeChange = useCallback(
    async (e: SwitchChangeEvent) => {
      setShouldRelaunchIndex(true)
      await setShowExperimentArrange(e.detail.value)
      return {
        checked: (await getTaskCardSettings()).showExperimentArrange,
        disabled: false,
      }
    },
    [setShouldRelaunchIndex]
  )

  const onShowExamArrangeChange = useCallback(
    async (e: SwitchChangeEvent) => {
      setShouldRelaunchIndex(true)
      await setShowExamArrange(e.detail.value)
      return {
        checked: (await getTaskCardSettings()).showExamArrange,
        disabled: false,
      }
    },
    [setShouldRelaunchIndex]
  )

  const onShowCustomExamArrange = useCallback(
    async (e: SwitchChangeEvent) => {
      setShouldRelaunchIndex(true)
      await setShowCustomExamArrange(e.detail.value)
      return {
        checked: (await getTaskCardSettings()).showCustomExamArrange,
        disabled: false,
      }
    },
    [setShouldRelaunchIndex]
  )

  return (
    <LineDividedSwitchList
      items={[
        {
          title: '显示实验安排',
          init: {
            checked: taskCardSettings?.showExperimentArrange,
            disabled: loadingTaskCardSettings,
          },
          onChange: onShowExperimentArrangeChange,
        },
        {
          title: '显示考试安排',
          init: {
            checked: taskCardSettings?.showExamArrange,
            disabled: loadingTaskCardSettings,
          },
          onChange: onShowExamArrangeChange,
        },
        {
          title: '显示自定义考试安排',
          init: {
            checked: taskCardSettings?.showCustomExamArrange,
            disabled: loadingTaskCardSettings,
          },
          onChange: onShowCustomExamArrange,
        },
      ]}
    />
  )
}

/** 待办卡片设置页面 */
const Index: React.FC = () => {
  const [setShouldRelaunchIndex] = useShouldRelaunchIndex(false)
  return <SwitchList setShouldRelaunchIndex={setShouldRelaunchIndex} />
}

export default Index
