import AsyncSwitch from "../AsyncSwitch";
import LineDividedList from "../LineDividedList";
import type { AsyncSwitchProps } from "../AsyncSwitch";
import type { ReactNode } from "react";

interface LineDividedSwitchItemProps extends AsyncSwitchProps {
    /** 开关标题 */
    title: ReactNode
    /** 开关图标 */
    icon?: ReactNode
}


interface LineDividedSwitchListProps {
    items: LineDividedSwitchItemProps[];
}

const LineDividedSwitchList: React.FC<LineDividedSwitchListProps> = ({ items }) => {
    return <LineDividedList
        items={items.map(item => ({
            content: <>
                {item.title}
                <AsyncSwitch {...{
                    ...item,
                }} />
            </>,
            icon: item.icon,
        }))}
    />
}

export default LineDividedSwitchList