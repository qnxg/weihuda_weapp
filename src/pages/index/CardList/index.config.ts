import CampusCard from './cards/CampusCard'
import CountdownCard from './cards/CountdownCard'
import ElectricityCard from './cards/ElectricityCard'
import EmailCard from './cards/EmailCard'
import GradeCard from './cards/GradeCard'
import MessageCard from './cards/MessageCard'
import NetflowCard from './cards/NetflowCard'
import RecentClassCard from './cards/RecentClassCard'
import SignInCard from './cards/SignInCard'
import HomeSwiperCard from './cards/SwiperCard'
import TaskCard from './cards/TaskCard'
import TodayClassCard from './cards/TodayClassCard'
import { DEFAULT_INDEX_NORMAL_CARD_SETTINGS } from '@/utils/storage/userSettings/defaults/indexNormalCardSettings'
import type CardProps from './CardProps'
import type React from 'react'

/** 置顶的，用户无法从统一卡片设置页面设置显示与否或顺序的卡片 */
export const topCards: [string, React.FC<CardProps>][] = [
  ['签到卡片', SignInCard],
  ['消息盒子', MessageCard],
]

/**
 * 这里应该列出了所有可配置的卡片，
 * 应该没有列出置顶的或无法配置的卡片，
 * 这个对象中的键的文本用于卡片排序页面。
 * 如果在此处添加/删除/修改了字段，一定要一同修改卡片默认设置
 */
const customizableCards = {
  今日知湖: HomeSwiperCard,
  今日课程: TodayClassCard,
  近期待办: TaskCard,
  近期课程: RecentClassCard,
  本月流量: NetflowCard,
  宿舍电量: ElectricityCard,
  假期倒计时: CountdownCard,
  校园卡余额: CampusCard,
  校园邮箱: EmailCard,
  成绩查询: GradeCard,
} as const satisfies Record<string, React.FC<CardProps>>

export type CardEnum = keyof typeof customizableCards

export const customizableCardsMap = new Map(
  Object.entries(customizableCards)
) as Map<CardEnum, React.FC<CardProps>>

const show = new Set(DEFAULT_INDEX_NORMAL_CARD_SETTINGS.show)
const dontShow = new Set(DEFAULT_INDEX_NORMAL_CARD_SETTINGS.dontShow)
if (
  show.intersection(dontShow).size != 0 ||
  show.union(dontShow).symmetricDifference(customizableCardsMap).size != 0
) {
  throw new Error('首页卡片默认配置有误')
}
