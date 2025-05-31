import { useMemo } from "react";
import { getUserSettings, modifyUserSettings } from "..";
import { DEFAULT_INDEX_NORMAL_CARD_SETTINGS } from "../defaults/indexNormalCardSettings";
import { type CardEnum } from "@/pages/index/CardList/index.config";
import usePromise from "@/utils/hooks/usePromise";
import type { DependencyList } from "react";


async function computeFinalCardDisplay(): Promise<[Set<CardEnum>, Set<CardEnum>]> {
  const userCardSettings = await getUserSettings(s => s.indexCardSettings);
  const defaultShow = new Set(DEFAULT_INDEX_NORMAL_CARD_SETTINGS.show);
  const defaultDontShow = new Set(DEFAULT_INDEX_NORMAL_CARD_SETTINGS.dontShow);
  const existingCards = defaultShow.union(defaultDontShow)

  // 最终综合考虑后要显示的卡片
  const shouldShow = new Set(userCardSettings.show)
    // 设置后向兼容
    .union(
      defaultShow
        .difference(new Set(userCardSettings.dontShow))
    )
    .intersection(existingCards);
  // 最终综合考虑后不显示的卡片
  const shouldNotShow = defaultDontShow
    .union(defaultShow)
    .difference(shouldShow)
    .intersection(existingCards);

  return [shouldShow, shouldNotShow];
}

export async function saveCardSettings(show: Set<CardEnum>, dontShow: Set<CardEnum>) {
  await modifyUserSettings(s => {
    return {
      ...s,
      indexCardSettings: {
        settingsMajorVersion:
          DEFAULT_INDEX_NORMAL_CARD_SETTINGS.settingsMajorVersion,
        show: Array.from(show),
        dontShow: Array.from(dontShow)
      }
    }
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