import CampusCard from "../CampusCard";
import CountdownCard from "../CountdownCard";
import ElectricityCard from "../ElectricityCard";
import EmailCard from "../EmailCard";
import GradeCard from "../GradeCard";
import MessageCard from "../MessageCard";
import NetflowCard from "../NetflowCard";
import HomeSwiperCard from "../SwiperCard";
import TodayClassCard from "../TodayClassCard";
import { CustomizableCardsConfig, UserCardDisplaySetting } from "./CardListSortablePart";
import CardProps from "../CardProps";

/** 如果更改这个值，
 * 则原本的用户设置都将被忽略，
 * 首页卡片使用默认设置，
 * 直到用户重新自定义
 */
const configMajorVersion = "0"

/** 这里应该列出所有可配置的卡片 */
const cards = {
    MessageCard: MessageCard,
    HomeSwiperCard: HomeSwiperCard,
    TodayClassCard: TodayClassCard,
    NetflowCard: NetflowCard,
    ElectricityCard: ElectricityCard,
    CountdownCard: CountdownCard,
    CampusCard: CampusCard,
    EmailCard: EmailCard,
    GradeCard: GradeCard,
}

export type CardEnum = keyof typeof cards

export const customizableCardsConfig
    : CustomizableCardsConfig<CardEnum> =
{
    configMajorVersion: configMajorVersion,
    customizableCards:
        new Map<CardEnum, React.FC<CardProps>>(
            Object.entries(cards) as any
        ),
}

export const defaultCardSetting
    : UserCardDisplaySetting<CardEnum> =
{
    configMajorVersion: configMajorVersion,
    show: new Set([
        'MessageCard',
        'HomeSwiperCard',
        'TodayClassCard',
        'NetflowCard',
        'ElectricityCard',
        'CountdownCard',
        'CampusCard',
        'EmailCard',
        'GradeCard',
    ]),
    dontShow: new Set(),
}

if (
    defaultCardSetting.configMajorVersion !=
    customizableCardsConfig.configMajorVersion
) {
    // hard error
    throw "首页卡片配置错误，请检查配置版本"
}

if (
    new Set(Object.keys(cards))
        .difference(defaultCardSetting.show)
        .difference(defaultCardSetting.dontShow)
        .size > 0
) {
    // hard error
    throw "首页卡片默认设置与实际卡片不匹配，请检查"
}