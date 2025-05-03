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
import { CustomizableCardsConfig, UserCardDisplaySetting } from "./ConfigurableCardList";
import CardProps from "../CardProps";

/** 置顶的，用户无法设置显示与否和顺序的卡片 */
export const topCards: [string, React.FC<CardProps>][] =
    [["消息盒子", MessageCard]]

/** 如果更改这个值，
 * 则原本的用户设置都将被忽略，
 * 首页卡片使用默认设置，
 * 直到用户重新自定义
 */
const configMajorVersion = "0"

/** 
 * 这里应该列出了所有可配置的卡片，
 * 应该没有列出置顶的或无法配置的卡片，
 * 这个对象中的键的文本用于卡片排序页面。
 * 如果在此处添加了卡片，一定要一同修改卡片默认设置
 */
const cards = {
    今日知湖: HomeSwiperCard,
    今日课程: TodayClassCard,
    本月流量: NetflowCard,
    宿舍电量: ElectricityCard,
    假期倒计时: CountdownCard,
    校园卡余额: CampusCard,
    校园邮箱: EmailCard,
    成绩查询: GradeCard,
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

/** 默认卡片设置，应该包含`cards`里所有的键 */
export const defaultCardSetting
    : UserCardDisplaySetting<CardEnum> =
{
    configMajorVersion: configMajorVersion,
    show: new Set([
        '今日知湖',
        '今日课程',
        '本月流量',
        '宿舍电量',
        '假期倒计时',
        '校园卡余额',
        '校园邮箱',
        '成绩查询',
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