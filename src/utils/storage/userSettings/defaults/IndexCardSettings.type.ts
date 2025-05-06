import { CardEnum } from "@/pages/index/components/CardList/index.config";
import { SettingsItem } from "./index.type";


export interface IndexCardSettings extends SettingsItem {
  show: CardEnum[];
  dontShow: CardEnum[];
}
