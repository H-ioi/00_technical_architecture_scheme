// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  srcDir: 'src/',
  ssr: true,
  compatibilityDate: '2026-04-21',
  typescript: {
    strict: true
  },
  nitro: {
    // Nuxt 3.17+ with srcDir needs explicit scan for colocated server routes.
    scanDirs: ['src/server']
  },
  runtimeConfig: {
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:8000'
    }
  },
  // 路由级缓存：/api 走 SWR，60s 内复用缓存并在后台更新（见 Nuxt routeRules）
  routeRules: {
    '/api/**': {
      swr: 60
    }
  },
  app: {
    head: {
      title: 'Nuxt 案例模版',
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      meta: [
        { name: 'description', content: 'Nuxt 3 案例模版：组件、布局、接口与缓存' },
        { name: 'theme-color', content: '#00c16a' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap'
        }
      ]
    }
  },
  css: ['@/assets/styles/main.scss'],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          // 避免对 _vars 自身再注入 @use，否则自引用会触发解析错误（如“应为 {”）
          additionalData: (source, file) => {
            const f = file?.replace(/\\/g, '/') ?? ''
            if (f.includes('_vars.scss') || f.includes('assets/styles/_vars')) {
              return source
            }
            return '@use "@/assets/styles/_vars.scss" as *;\n' + source
          }
        }
      }
    }
  }
})
