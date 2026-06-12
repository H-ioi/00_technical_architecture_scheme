import fs from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import { defineConfig, loadEnv } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

const require = createRequire(import.meta.url)
const adminWebDir = fileURLToPath(new URL('.', import.meta.url))
/**  monorepo 本地联调：优先读 sibling uni-lib/dist，避免 file: 在 Windows 复制到 node_modules 后 rebuild 仍命中旧 dist */
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

const isEnvEnabled = (value?: string) => {
  const normalized = value?.trim().split(/\s+/)[0]?.toLowerCase()
  return normalized === 'true' || normalized === '1' || normalized === 'yes'
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const pwaDevEnabled = isEnvEnabled(env.VITE_PWA_DEV)

  return {
    base: env.VITE_APP_BASE || '/',
    plugins: [
      vue(),
      VitePWA({
        registerType: 'prompt',
        // dev 默认不注册 SW；设置 VITE_PWA_DEV=true 可在 npm run dev 下联调 PWA
        devOptions: {
          enabled: pwaDevEnabled,
          navigateFallback: 'index.html'
        },
        includeAssets: ['pwa-192x192.png', 'pwa-512x512.png'],
        manifest: {
          name: env.VITE_APP_TITLE || 'Admin Web',
          short_name: 'Admin',
          description: 'Admin Web PWA',
          theme_color: '#409EFF',
          background_color: '#ffffff',
          display: 'standalone',
          scope: env.VITE_APP_BASE || '/',
          start_url: env.VITE_APP_BASE || '/',
          icons: [
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png'
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable'
            }
          ]
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
          navigateFallback: 'index.html'
        }
      })
    ],
    /** 与 file:../uni-lib 联调：避免把组件库打进 optimize 缓存，否则 rebuild uni-lib 后仍可能读到旧的 deps 缓存 */
    optimizeDeps: {
      exclude: ['uni-ui-lib']
    },
    resolve: {
      dedupe: ['vue', 'vue-router', '@vue/shared'],
      /** 数组顺序：先匹配 style 子路径，再用 /^uni-ui-lib$/ 精确匹配入口，避免 uni-ui-lib 前缀误伤 style.css */
      alias: [
        { find: 'uni-ui-lib/style.css', replacement: uniLibCss },
        { find: 'uni-ui-lib/dist/index.css', replacement: uniLibCss },
        { find: /^uni-ui-lib$/, replacement: uniLibEntry },
        {
          find: '@',
          replacement: fileURLToPath(new URL('./src', import.meta.url))
        },
        /** vuedraggable 误把 UMD 标成 module；走源码入口，否则预构建会令 defineComponent 内 isFunction 异常 */
        {
          find: 'vuedraggable',
          replacement: fileURLToPath(
            new URL('./node_modules/vuedraggable/src/vuedraggable.js', import.meta.url)
          )
        }
      ]
    },
    server: {
      host: '0.0.0.0',
      port: 8100,
      proxy: {
        ...(env.VITE_API_PROXY_TARGET
          ? {
              '/api': {
                target: env.VITE_API_PROXY_TARGET,
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, '')
              }
            }
          : {}),
        // 本地上传走同源代理，避免直连 upload 域名触发 CORS；与 .env.development 中 VITE_UPLOAD_URL=/isa-file-upload/upload/ 对应
        '/isa-file-upload': {
          target: env.VITE_UPLOAD_PROXY_TARGET || 'https://upload.isagzth.com',
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/isa-file-upload/, '')
        }
      }
    },
    build: {
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            vue: ['vue', 'vue-router', 'pinia'],
            elementPlus: ['element-plus', '@element-plus/icons-vue']
          }
        }
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          silenceDeprecations: ['legacy-js-api'],
          additionalData: `@use "@/assets/styles/variables" as *;`
        }
      }
    }
  }
})
