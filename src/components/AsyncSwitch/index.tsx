import { Switch } from "@tarojs/components";
import classNames from "classnames";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import style from "./index.module.scss"
import type { BaseEventOrig, SwitchProps } from "@tarojs/components";

export interface SwitchState {
    checked: boolean,
    disabled: boolean
}

type ChangeEvent = BaseEventOrig<SwitchProps.onChangeEventDetail>;

export interface AsyncSwitchProps {
    /** 
     * 初始化函数，应当注意在该函数变化时一定会重新初始化。
     * 你可能需要`useCallback`
    */
    init: () => Promise<SwitchState>
    /** 切换事件，应当返回切换后的状态 */
    onChange: (e: ChangeEvent) => Promise<SwitchState>
    /** 重新初始化的trigger，使其改变会重新调用初始化 */
    reInitTrigger?: unknown,
    /** CSS类名 */
    className?: string
}

const AsyncSwitch: React.FC<AsyncSwitchProps> = (props) => {
    const { init, onChange } = props;
    const [state, setState] = useState<undefined | SwitchState>(undefined);
    useEffect(() => {
        void (async () => {
            const initState = await init()
            setState(initState)
        })()
    }, [init, props.reInitTrigger])
    const [changing, setChanging] = useState(false);
    const handleChange = useCallback(async (e: ChangeEvent) => {
        setChanging(true);
        const newState = await onChange(e)
        setState(newState)
        setChanging(false)
    }, [onChange]);
    const realDisabled = state?.disabled || changing;
    return (
        state == undefined ? <></> :
            <Switch
                className={
                    classNames(
                        props.className,
                        { [style.disabled]: realDisabled },
                    )
                }
                color="#328ccb"
                controlled="true"
                checked={state.checked}
                disabled={realDisabled}
                onChange={handleChange}
            />
    )
}

export default AsyncSwitch