import { modifyUserSettingsPart } from '..'

export async function setNeedDisplayNotCurrentWeekClasses(needed: boolean) {
  await modifyUserSettingsPart('classtablePageSettings', async old => ({
    ...old,
    needDisplayNotCurrentWeekClasses: needed,
  }))
}
