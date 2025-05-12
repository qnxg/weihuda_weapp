import { CardEnum } from "@/pages/index/components/CardList/index.config";
import { SettingsItem } from "./index.interface";


export interface IndexCardSettings extends SettingsItem {
  show: CardEnum[];
  dontShow: CardEnum[];
}
