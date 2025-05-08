export interface SettingsItem {
    /** 用于设置的后向兼容，
     * 当用户配置中的这项和默认配置的这项不同时，
     * 应该忽略用户配置，使用默认配置 */
    settingsMajorVersion: string
}

export interface Settings { [key: string]: SettingsItem | undefined} 