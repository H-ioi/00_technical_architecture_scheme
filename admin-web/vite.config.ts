import { defineConfig, loadEnv } from 'vite'

import { createAdminWebConfig } from './vite.config.shared'

/** 构建与 preview：走 node_modules 中的 uni-ui-lib */
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return createAdminWebConfig({
    base: env.VITE_APP_BASE || '/',
    env
  })
})
