import fs from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'

import { createAdminWebConfig } from './vite.config.shared'

const require = createRequire(import.meta.url)
const adminWebDir = fileURLToPath(new URL('.', import.meta.url))
/** monorepo 本地联调：优先读 sibling uni-lib/dist，避免 file: 在 Windows 复制到 node_modules 后 rebuild 仍命中旧 dist */
const uniLibDistDir = path.resolve(adminWebDir, '../uni-lib/dist')
const uniLibDistEntry = path.join(uniLibDistDir, 'index.mjs')
const uniLibDistCss = path.join(uniLibDistDir, 'index.css')
const hasLocalUniLibDist = fs.existsSync(uniLibDistEntry)
const resolvedPkgEntry = require.resolve('uni-ui-lib')
const uniLibEntry = hasLocalUniLibDist
  ? uniLibDistEntry
  : path.join(path.dirname(resolvedPkgEntry), 'index.mjs')
const uniLibCss = hasLocalUniLibDist
  ? uniLibDistCss
  : path.join(path.dirname(resolvedPkgEntry), 'index.css')

/** 本地联调 uni-lib：npm run dev / dev:force */
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return createAdminWebConfig({
    base: env.VITE_APP_BASE || '/',
    env,
    uniLibAliases: [
      { find: 'uni-ui-lib/style.css', replacement: uniLibCss },
      { find: 'uni-ui-lib/dist/index.css', replacement: uniLibCss },
      { find: /^uni-ui-lib$/, replacement: uniLibEntry }
    ],
    optimizeDeps: {
      exclude: ['uni-ui-lib']
    }
  })
})
