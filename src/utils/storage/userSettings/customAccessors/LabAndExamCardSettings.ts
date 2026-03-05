import { modifyUserSettingsPart } from '..'

export async function setShowExperimentArrange(shouldShow: boolean) {
  await modifyUserSettingsPart('indexLabAndExamCardSettings', async old => ({
    ...old,
    showExperimentArrange: shouldShow,
  }))
}

export async function setShowExamArrange(shouldShow: boolean) {
  await modifyUserSettingsPart('indexLabAndExamCardSettings', async old => ({
    ...old,
    showExamArrange: shouldShow,
  }))
}

export async function setShowCustomExamArrange(shouldShow: boolean) {
  await modifyUserSettingsPart('indexLabAndExamCardSettings', async old => ({
    ...old,
    showCustomExamArrange: shouldShow,
  }))
}
