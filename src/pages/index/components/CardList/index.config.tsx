import React from "react";
import CampusCard from "../CampusCard";
import CountdownCard from "../CountdownCard";
import ElectricityCard from "../ElectricityCard";
import EmailCard from "../EmailCard";
import GradeCard from "../GradeCard";
import MessageCard from "../MessageCard";
import NetflowCard from "../NetflowCard";
import HomeSwiperCard from "../SwiperCard";
import TodayClassCard from "../TodayClassCard";
import CardProps from "../CardProps";

/** 置顶的，用户无法设置显示与否和顺序的卡片 */
export const topCards: [string, React.FC<CardProps>][] =
    [["消息盒子", MessageCard]]

/** 
 * 这里应该列出了所有可配置的卡片，
 * 应该没有列出置顶的或无法配置的卡片，
 * 这个对象中的键的文本用于卡片排序页面。
 * 如果在此处添加了卡片，一定要一同修改卡片默认设置
 */
const customizableCards = {
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