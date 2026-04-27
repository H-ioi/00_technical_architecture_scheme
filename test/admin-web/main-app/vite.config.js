import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      'shared-components': path.resolve(__dirname, '../shared-components/src/index.js')
    }
  },
  server: {
    port: 3000,
    cors: true
  },
  optimizeDeps: {
    include: [
      'vue',
      'vue-router',
      'pinia',
      'vuex',
      'ant-design-vue',
      'lodash-es',
      'moment',
      'axios',
      'shared-components'
    ]
  }
})
