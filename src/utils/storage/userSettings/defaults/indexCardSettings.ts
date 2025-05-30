import { type CardEnum } from "@/pages/index/CardList/index.config"
import type { SettingsItem } from ".";

/** 首页卡片设置的结构 */
export interface IndexCardSettings extends SettingsItem {
  show: CardEnum[];
  dontShow: CardEnum[];
}

/** 默认卡片设置，应该列举了所有能配置的卡片 */
export const DEFAULT_INDEX_CARD_SETTINGS: IndexCardSettings = {
  settingsMajorVersion: "0",
  show: [
    '今日知湖',
    '今日课程',
    '本月流量',
    '宿舍电量',
    '假期倒计时',
    '校园卡余额',
    '校园邮箱',
    '成绩查询',
  ],
  dontShow: []
}