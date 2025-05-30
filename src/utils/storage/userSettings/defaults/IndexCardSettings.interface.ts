import type { SettingsItem } from "./index.interface";
import type { CardEnum } from "@/pages/index/CardList/index.config";

/** 首页卡片设置的结构 */
export interface IndexCardSettings extends SettingsItem {
  show: CardEnum[];
  dontShow: CardEnum[];
}
