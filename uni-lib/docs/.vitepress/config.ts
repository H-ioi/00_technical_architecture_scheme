import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { defineConfig } from 'vitepress'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  title: 'uni-lib',
  description: 'Vue 3 + Element Plus 业务组件库',
  themeConfig: {
    nav: [
      { text: '指南', link: '/guide/getting-started' },
      { text: '组件', link: '/components/uni-data-table' },
      { text: '服务', link: '/services/request' }
    ],
    sidebar: [
      {
        text: '指南',
        items: [
          { text: '快速开始', link: '/guide/getting-started' },
          { text: '主题', link: '/guide/theme' },
          { text: '旧系统迁移', link: '/guide/migration-from-old-admin' }
        ]
      },
      {
        text: '组件',
        items: [
          { text: 'UniDataTable', link: '/components/uni-data-table' },
          { text: 'UniForm', link: '/components/uni-form' },
          { text: 'UniSearchForm', link: '/components/uni-search-form' },
          { text: 'UniUpload', link: '/components/uni-upload' }
        ]
      },
      {
        text: '服务',
        items: [
          { text: 'Request', link: '/services/request' },
          { text: 'Auth', link: '/services/auth' },
          { text: 'I18n', link: '/services/i18n' },
          { text: 'Theme', link: '/services/theme' }
        ]
      }
    ]
  },
  vite: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '../../src'),
      },
    },
    ssr: {
      noExternal: ['element-plus'],
    },
  },
})
