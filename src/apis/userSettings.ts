import request from "./request"
import { UserSettings } from "@/utils/storage/userSettings/defaults"

export const getAllUserSettingsApi = () => {
    return request.get<UserSettings>('/user-settings/all')
}

export const setAllUserSettingsApi = (all_settings: UserSettings) => {
    return request.post('/user-settings/all', {
        data: all_settings
    })
}