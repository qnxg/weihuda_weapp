import { type CardEnum } from "@/pages/index/CardList/index.config"
import type { SettingsItem } from ".";

/** 首页常规卡片设置的结构 */
export interface IndexNormalCardSettings extends SettingsItem {
  show: CardEnum[];
  dontShow: CardEnum[];
}

/** 默认常规卡片设置，应该列举了所有能配置的卡片 */
export const DEFAULT_INDEX_NORMAL_CARD_SETTINGS: IndexNormalCardSettings = {
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