/** 问卷 C 端报名页完整 URL（依赖 VITE_COMMUNITY_WEB_ORIGIN） */
export function buildQuestionnaireSignupUrl(questionnaireId: string | number): string {
  const origin = String(import.meta.env.VITE_COMMUNITY_WEB_ORIGIN ?? '').replace(/\/$/, '')
  if (!origin) {
    return ''
  }
  return `${origin}/#/isacommunity/activity/questionnaire/signup?id=${encodeURIComponent(String(questionnaireId))}`
}
