import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

const require = createRequire(import.meta.url)
// exports 未导出 package.json，不能用 resolve('uni-ui-lib/package.json')
const uniLibEntry = require.resolve('uni-ui-lib')
const uniLibCss = path.join(path.dirname(uniLibEntry), 'index.css')

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    base: env.VITE_APP_BASE || '/',
    plugins: [vue()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        'uni-ui-lib/style.css': uniLibCss,
        'uni-ui-lib/dist/index.css': uniLibCss
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
    }
  }
})
