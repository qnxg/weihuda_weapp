import CampusCard from "./cards/CampusCard";
import CountdownCard from "./cards/CountdownCard";
import ElectricityCard from "./cards/ElectricityCard";
import EmailCard from "./cards/EmailCard";
import GradeCard from "./cards/GradeCard";
import MessageCard from "./cards/MessageCard";
import NetflowCard from "./cards/NetflowCard";
import SignInCard from "./cards/SignInCard";
import HomeSwiperCard from "./cards/SwiperCard";
import TodayClassCard from "./cards/TodayClassCard";
import type CardProps from "./CardProps";
import type React from "react";

/** 置顶的，用户无法设置显示与否和顺序的卡片 */
export const topCards: [string, React.FC<CardProps>][] =
    [["消息盒子", MessageCard]]

/** 
 * 这里应该列出了所有可配置的卡片，
 * 应该没有列出置顶的或无法配置的卡片，
 * 这个对象中的键的文本用于卡片排序页面。
 * 如果在此处添加/删除/修改了字段，一定要一同修改卡片默认设置
 */
const customizableCards = {
    签到卡片: SignInCard,
    今日知湖: HomeSwiperCard,
    今日课程: TodayClassCard,
    本月流量: NetflowCard,
    宿舍电量: ElectricityCard,
    假期倒计时: CountdownCard,
    校园卡余额: CampusCard,
    校园邮箱: EmailCard,
    成绩查询: GradeCard,
} as const satisfies Record<string, React.FC<CardProps>>;

export type CardEnum = keyof typeof customizableCards

export const customizableCardsMap =
    new Map(Object.entries(customizableCards)) as Map<CardEnum, React.FC<CardProps>>