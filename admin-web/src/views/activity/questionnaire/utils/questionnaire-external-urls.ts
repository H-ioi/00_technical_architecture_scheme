/** 家长端问卷报名链接；问卷题目与答卷在管理端站内页维护。 */


function stripSlash(s: string): string {
  return s.replace(/\/$/, '')
}

export function buildQuestionnaireSignupUrl(questionnaireId: string | number): string {
  const origin = stripSlash(String(import.meta.env.VITE_COMMUNITY_WEB_ORIGIN ?? ''))
  if (!origin) {
    return ''
  }


  return `${origin}/#/isacommunity/activity/questionnaire/signup?id=${encodeURIComponent(String(questionnaireId))}`
}
