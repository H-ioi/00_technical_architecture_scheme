interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_BASE?: string
  readonly VITE_API_BASE_URL: string
  readonly VITE_API_PROXY_TARGET?: string
  readonly VITE_TENANT_ID: string
  readonly VITE_API_VERSION: string
  readonly VITE_UPLOAD_URL?: string
  readonly VITE_ENABLE_MOCK?: string
  readonly VITE_SENTRY_DSN?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
