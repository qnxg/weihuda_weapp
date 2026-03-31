import { modifyUserSettingsPart } from '..'

export async function setNeedShowSignInCard(needShow: boolean) {
  await modifyUserSettingsPart('indexSignInCardSettings', async old => ({
    ...old,
    show: needShow,
  }))
}
