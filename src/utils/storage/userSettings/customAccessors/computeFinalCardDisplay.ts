import { CardEnum } from "@/pages/index/components/CardList/index.config";
import { getUserSettingsSync, modifyUserSettingsSync } from "..";
import { DEFAULT_INDEX_CARD_SETTINGS } from "../defaults/indexCardSettings";


export function computeFinalCardDisplay(): [Set<CardEnum>, Set<CardEnum>] {
  const userCardSettings = getUserSettingsSync(s => s.indexCardSettings);
  const defaultShow = new Set(DEFAULT_INDEX_CARD_SETTINGS.show);
  const defaultDontShow = new Set(DEFAULT_INDEX_CARD_SETTINGS.dontShow);

  // 最终综合考虑后要显示的卡片
  const shouldShow = new Set(userCardSettings.show)
    // 设置后向兼容
    .union(
      defaultShow
        .difference(new Set(userCardSettings.dontShow))
    );
  // 最终综合考虑后不显示的卡片
  const shouldNotShow = defaultDontShow.union(defaultShow).difference(shouldShow);

  return [shouldShow, shouldNotShow];
}

export function saveCardSettings(show: Set<CardEnum>, dontShow: Set<CardEnum>) {
  modifyUserSettingsSync(s => {
    s.indexCardSettings = {
      settingsMajorVersion:
        DEFAULT_INDEX_CARD_SETTINGS.settingsMajorVersion,
      show: Array.from(show),
      dontShow: Array.from(dontShow)
    }
    return s
  })
}