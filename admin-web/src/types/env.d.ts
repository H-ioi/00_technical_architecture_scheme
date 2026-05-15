interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_BASE?: string
  readonly VITE_API_BASE_URL: string
  readonly VITE_API_PROXY_TARGET?: string
  readonly VITE_TENANT_ID: string
  readonly VITE_API_VERSION: string
  readonly VITE_UPLOAD_URL?: string
  /** 开发时上传代理目标，默认 https://upload.isagzth.com；仅 vite server 读取 */
  readonly VITE_UPLOAD_PROXY_TARGET?: string
  readonly VITE_ENABLE_MOCK?: string
  readonly VITE_SENTRY_DSN?: string
  /** 社区前台站点 origin（问卷报名链接等），末尾不要斜杠 */
  readonly VITE_COMMUNITY_WEB_ORIGIN?: string
  /** 含问卷题目设计的旧 SPA 根 URL（无则回退到 VITE_COMMUNITY_WEB_ORIGIN） */
  readonly VITE_QUESTIONNAIRE_EDITOR_ORIGIN?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
