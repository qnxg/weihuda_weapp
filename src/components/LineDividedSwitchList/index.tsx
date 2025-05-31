import AsyncSwitch from '../AsyncSwitch'
import LineDividedList from '../LineDividedList'
import type { AsyncSwitchProps } from '../AsyncSwitch'
import type { ReactNode } from 'react'

interface LineDividedSwitchItemProps extends AsyncSwitchProps {
  /** 开关标题 */
  title: ReactNode
  /** 开关图标 */
  icon?: ReactNode
}

interface LineDividedSwitchListProps {
  /**
   * 开关列表配置
   *
   * 重要：init请注意是否要使用useCallback，否则可能造成多次调用
   */
  items: LineDividedSwitchItemProps[]
}

/**
 * 纵向组织的由分隔线隔开的开关列表
 *
 * 重要：init请注意是否要使用useCallback，否则可能造成多次调用
 */
const LineDividedSwitchList: React.FC<LineDividedSwitchListProps> = ({
  items,
}) => {
  return (
    <LineDividedList
      items={items.map(item => ({
        content: (
          <>
            {item.title}
            <AsyncSwitch
              {...{
                ...item,
              }}
            />
          </>
        ),
        icon: item.icon,
      }))}
    />
  )
}

export default LineDividedSwitchList
