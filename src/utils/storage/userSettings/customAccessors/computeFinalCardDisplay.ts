import { useMemo } from "react";
import { getUserSettings, modifyUserSettings } from "..";
import { DEFAULT_INDEX_CARD_SETTINGS } from "../defaults/indexCardSettings";
import usePromise from "@/utils/hooks/usePromise";
import type { CardEnum } from "@/pages/index/components/CardList/index.config";
import type { DependencyList} from "react";

async function computeFinalCardDisplay(): Promise<[Set<CardEnum>, Set<CardEnum>]> {
  const userCardSettings = await getUserSettings(s => s.indexCardSettings);
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

export async function saveCardSettings(show: Set<CardEnum>, dontShow: Set<CardEnum>) {
  await modifyUserSettings(s => {
    s.indexCardSettings = {
      settingsMajorVersion:
        DEFAULT_INDEX_CARD_SETTINGS.settingsMajorVersion,
      show: Array.from(show),
      dontShow: Array.from(dontShow)
    }
    return s
  })
}

export function useFinalCardDisplay(deps: DependencyList) {
  const computeFinalCardDisplayMemo = useMemo(computeFinalCardDisplay, [...deps]);
  const [cardsToDisplay] =
    usePromise<[Set<CardEnum>, Set<CardEnum>]>(
      () => computeFinalCardDisplayMemo,
      () => [new Set(), new Set()],
      [...deps]
    );
  return cardsToDisplay
}