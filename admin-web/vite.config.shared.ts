import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import type { Alias, UserConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export const isEnvEnabled = (value?: string) => {
  const normalized = value?.trim().split(/\s+/)[0]?.toLowerCase()
  return normalized === 'true' || normalized === '1' || normalized === 'yes'
}

type AdminWebConfigOptions = {
  base: string
  env: Record<string, string>
  uniLibAliases?: Alias[]
  optimizeDeps?: UserConfig['optimizeDeps']
}

export const createAdminWebConfig = ({
  base,
  env,
  uniLibAliases = [],
  optimizeDeps
}: AdminWebConfigOptions): UserConfig => {
  const pwaDevEnabled = isEnvEnabled(env.VITE_PWA_DEV)

  return {
    base,
    plugins: [
      vue(),
      VitePWA({
        registerType: 'prompt',
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
          scope: base,
          start_url: base,
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
    optimizeDeps,
    resolve: {
      dedupe: ['vue', 'vue-router', '@vue/shared'],
      alias: [
        ...uniLibAliases,
        {
          find: '@',
          replacement: fileURLToPath(new URL('./src', import.meta.url))
        },
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
}
