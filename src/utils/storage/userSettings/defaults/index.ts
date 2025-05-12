import { Settings } from "./index.interface";
import { DEFAULT_INDEX_CARD_SETTINGS } from "./indexCardSettings";


export const DEFAULT_SETTINGS = {
    /** 首页卡片设置 */
    indexCardSettings: DEFAULT_INDEX_CARD_SETTINGS
} satisfies Settings

/** 当前小程序的所有用户配置项目列于此处
 *
 * 由于微信小程序以及后端实现限制，配置必须可以正确的被JSON.stringyfy
 */
export type UserSettings = typeof DEFAULT_SETTINGS