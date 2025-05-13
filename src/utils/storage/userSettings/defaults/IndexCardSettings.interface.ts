import { SettingsItem } from "./index.interface";
import { CardEnum } from "@/pages/index/components/CardList/index.config";


export interface IndexCardSettings extends SettingsItem {
  show: CardEnum[];
  dontShow: CardEnum[];
}
