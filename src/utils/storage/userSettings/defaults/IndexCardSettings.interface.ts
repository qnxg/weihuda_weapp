import { SettingsItem } from "./index.interface";
import type { CardEnum } from "@/pages/index/components/CardList/index.config";

/** 首页卡片设置的结构 */
export interface IndexCardSettings extends SettingsItem {
  show: CardEnum[];
  dontShow: CardEnum[];
}
