/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  /** 开发环境是否启用 PWA Service Worker 注册 */
  readonly VITE_PWA_DEV?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
