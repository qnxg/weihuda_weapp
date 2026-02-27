import type { SettingsItem } from '.'

/** 课表页设置的结构 */
export interface ClasstablePageSettings extends SettingsItem {
  needDisplayNotCurrentWeekClasses: boolean
}

/** 课表页面设置的默认值 */
export const DEFAULT_CLASSTABLE_PAGE_SETTINGS: ClasstablePageSettings = {
  settingsMajorVersion: '0',
  needDisplayNotCurrentWeekClasses: true,
}
