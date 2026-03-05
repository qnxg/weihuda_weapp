import { useCallback } from 'react'
import LineDividedSwitchList from '@/components/LineDividedSwitchList'
import usePromise from '@/utils/hooks/usePromise'
import useShouldRelaunchIndex from '@/utils/hooks/useShouldRelaunchIndex'
import { fetchUserSettings } from '@/utils/storage/userSettings'
import {
  setShowCustomExamArrange,
  setShowExamArrange,
  setShowExperimentArrange,
} from '@/utils/storage/userSettings/customAccessors/LabAndExamCardSettings'
import type { SwitchChangeEvent } from '@/components/AsyncSwitch'

const getLabAndExamCardSettings = async () =>
  (await fetchUserSettings()).indexLabAndExamCardSettings

const SwitchList: React.FC<{
  setShouldRelaunchIndex: (s: boolean) => unknown
}> = ({ setShouldRelaunchIndex }) => {
  const [labAndExamCardSettings, loadingLabAndExamCardSettings] = usePromise(
    getLabAndExamCardSettings,
    undefined,
    [getLabAndExamCardSettings]
  )

  const onShowExperimentArrangeChange = useCallback(
    async (e: SwitchChangeEvent) => {
      setShouldRelaunchIndex(true)
      await setShowExperimentArrange(e.detail.value)
      return {
        checked: (await getLabAndExamCardSettings()).showExperimentArrange,
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
        checked: (await getLabAndExamCardSettings()).showExamArrange,
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
        checked: (await getLabAndExamCardSettings()).showCustomExamArrange,
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
            checked: labAndExamCardSettings?.showExperimentArrange,
            disabled: loadingLabAndExamCardSettings,
          },
          onChange: onShowExperimentArrangeChange,
        },
        {
          title: '显示考试安排',
          init: {
            checked: labAndExamCardSettings?.showExamArrange,
            disabled: loadingLabAndExamCardSettings,
          },
          onChange: onShowExamArrangeChange,
        },
        {
          title: '显示自定义考试安排',
          init: {
            checked: labAndExamCardSettings?.showCustomExamArrange,
            disabled: loadingLabAndExamCardSettings,
          },
          onChange: onShowCustomExamArrange,
        },
      ]}
    />
  )
}

/** 实验与考试卡片设置页面 */
const Index: React.FC = () => {
  const [setShouldRelaunchIndex] = useShouldRelaunchIndex(false)
  return <SwitchList setShouldRelaunchIndex={setShouldRelaunchIndex} />
}

export default Index
