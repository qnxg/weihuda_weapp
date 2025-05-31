import { modifyUserSettings } from "..";
import { DEFAULT_INDEX_SIGNIN_CARD_SETTINGS } from "../defaults/indexSignInCardSettings";

export async function setNeedShowSignInCard(needShow: boolean) {
    await modifyUserSettings(s => ({
        ...s,
        indexSignInCardSettings: {
            ...s.indexSignInCardSettings,
            settingsMajorVersion: DEFAULT_INDEX_SIGNIN_CARD_SETTINGS.settingsMajorVersion,
            show: needShow,
        },
    }))
}