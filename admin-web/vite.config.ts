import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import { defineConfig, loadEnv } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

const require = createRequire(import.meta.url)
// exports 未导出 package.json，不能用 resolve('uni-ui-lib/package.json')
const uniLibEntry = require.resolve('uni-ui-lib')
const uniLibCss = path.join(path.dirname(uniLibEntry), 'index.css')

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
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        'uni-ui-lib/style.css': uniLibCss,
        'uni-ui-lib/dist/index.css': uniLibCss,
        /** vuedraggable 误把 UMD 标成 module；走源码入口，否则预构建会令 defineComponent 内 isFunction 异常 */
        vuedraggable: fileURLToPath(
          new URL('./node_modules/vuedraggable/src/vuedraggable.js', import.meta.url)
        )
      }
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
          additionalData: `@import "@/assets/scss/styles/_variables.scss";`
        }
      }
    }
  }
})
