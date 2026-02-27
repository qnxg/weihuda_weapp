import { useCallback } from 'react'
import LineDividedSwitchList from '@/components/LineDividedSwitchList'
import usePromise from '@/utils/hooks/usePromise'
import { fetchUserSettings } from '@/utils/storage/userSettings'
import { setNeedDisplayNotCurrentWeekClasses } from '@/utils/storage/userSettings/customAccessors/classtablePageSettings'

const getClasstablePageSettings = async () =>
  (await fetchUserSettings()).classtablePageSettings

/** 课表页设置页面 */
const Index: React.FC = () => {
  const [classtablePageSettings, loadingClasstablePageSettings] = usePromise(
    getClasstablePageSettings,
    undefined,
    [getClasstablePageSettings]
  )

  return (
    <LineDividedSwitchList
      items={[
        {
          title: '显示非本周课程',
          init: {
            checked: classtablePageSettings?.needDisplayNotCurrentWeekClasses,
            disabled: loadingClasstablePageSettings,
          },
          onChange: useCallback(async e => {
            await setNeedDisplayNotCurrentWeekClasses(e.detail.value)
            return {
              checked: (await getClasstablePageSettings())
                .needDisplayNotCurrentWeekClasses,
              disabled: false,
            }
          }, []),
        },
      ]}
    />
  )
}

export default Index
