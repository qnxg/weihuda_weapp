import { type CardEnum } from '@/pages/index/CardList/index.config'
import type { SettingsItem } from '.'

/** 首页常规卡片设置的结构 */
export interface IndexNormalCardSettings extends SettingsItem {
  show: CardEnum[]
  dontShow: CardEnum[]
}

/** 默认常规卡片设置，应该列举了所有能配置的卡片 */
export const DEFAULT_INDEX_NORMAL_CARD_SETTINGS: IndexNormalCardSettings = {
  settingsMajorVersion: '1',
  show: [
    '我的课程',
    '假期倒计时',
    '本月流量',
    '宿舍电量',
    '校园卡余额',
    '校园邮箱',
    '实验与考试',
    '成绩查询',
  ],
  dontShow: [],
}
