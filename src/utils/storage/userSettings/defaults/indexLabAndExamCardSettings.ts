import type { SettingsItem } from '.'

/** 首页实验与考试卡片设置的结构 */
export interface IndexLabAndExamCardSettings extends SettingsItem {
  showExperimentArrange: boolean
  showExamArrange: boolean
  showCustomExamArrange: boolean
}

/** 首页实验与考试卡片默认设置 */
export const DEFAULT_INDEX_LAB_AND_EXAM_CARD_SETTINGS: IndexLabAndExamCardSettings =
  {
    settingsMajorVersion: '0',
    showExperimentArrange: true,
    showExamArrange: true,
    showCustomExamArrange: true,
  }
