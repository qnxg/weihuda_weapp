import { Switch } from '@tarojs/components'
import classNames from 'classnames'
import { useCallback, useEffect, useState } from 'react'
import style from './index.module.scss'
import useStateCallback from '@/utils/hooks/useStateCallback'
import type { BaseEventOrig, SwitchProps } from '@tarojs/components'
import type { DependencyList, SetStateAction } from 'react'

export interface SwitchState {
  /** 是否处于开状态，如果为undefined则开关不会显示 */
  checked: boolean | undefined
  /** 是否一定要禁用开关 */
  disabled: boolean
}

export type SwitchChangeEvent = BaseEventOrig<SwitchProps.onChangeEventDetail>

export interface AsyncSwitchProps {
  /**
   * 初始化状态或者初始化异步函数，应当注意在这个参数变化时一定会重新初始化。
   * 你可能需要`useCallback`
   */
  init: SwitchState | (() => Promise<SwitchState>)
  /**
   * 切换事件
   *
   * 若该函数返回了切换后的状态，则之后开关的状态由此决定。
   * 否则，开关的状态保持为切换后应有的状态。
   *
   * 若该函数抛出错误，则开关会停留在禁用状态
   */
  onChange: (e: SwitchChangeEvent) => Promise<SwitchState | undefined>
  /** 重新初始化的trigger，使其改变会重新调用初始化 */
  reInitDeps?: DependencyList
  /** CSS类名 */
  className?: string
}

/**
 * 支持异步操作的开关。
 */
const AsyncSwitch: React.FC<AsyncSwitchProps> = props => {
  const { init, onChange, reInitDeps = [] } = props
  const [state, setState] = useStateCallback<SwitchState>({
    checked: undefined,
    disabled: true,
  })

  /** 设置开关状态的工具函数 */
  const forcedSetState = useCallback(
    (newState: SetStateAction<SwitchState>) => {
      // https://github.com/NervJS/taro/issues/5218
      setState(
        s => ({
          disabled: true,
          checked: s.checked,
        }),
        () => setState(newState)
      )
    },
    [setState]
  )

  // 被改造的init，用于判断是否需要重新初始化
  const mappedInit =
    typeof init === 'function'
      ? init
      : JSON.stringify([init.checked, init.disabled])
  // 初始化
  useEffect(() => {
    void (async () => {
      let initState: SwitchState
      if (typeof init === 'function') {
        initState = await init()
      } else {
        initState = init
      }
      forcedSetState(initState)
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forcedSetState, mappedInit, ...reInitDeps])

  const [changing, setChanging] = useState(false)
  const handleChange = useCallback(
    async (e: SwitchChangeEvent) => {
      setChanging(true)
      const newState = await onChange(e)
      if (newState == undefined) {
        setState({
          disabled: state.disabled,
          checked: !(state.checked ?? true),
        })
      } else {
        forcedSetState(newState)
      }
      setChanging(false)
    },
    [forcedSetState, onChange, setState, state.checked, state.disabled]
  )
  const realDisabled = state.disabled || changing
  return state.checked == undefined ? (
    <></>
  ) : (
    <Switch
      className={classNames(props.className, {
        [style.disabled]: realDisabled,
      })}
      color='#328ccb'
      controlled='true'
      checked={state.checked}
      disabled={realDisabled}
      onChange={handleChange}
    />
  )
}

export default AsyncSwitch
