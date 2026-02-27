import type { SettingsItem } from '.'

/** 首页待办卡片设置的结构 */
export interface IndexTaskCardSettings extends SettingsItem {
  showExperimentArrange: boolean
  showExamArrange: boolean
  showCustomExamArrange: boolean
}

/** 首页待办卡片默认设置 */
export const DEFAULT_INDEX_TASK_CARD_SETTINGS: IndexTaskCardSettings = {
  settingsMajorVersion: '0',
  showExperimentArrange: true,
  showExamArrange: true,
  showCustomExamArrange: true,
}
