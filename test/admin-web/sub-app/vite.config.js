import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const isMicro = env.VITE_MICRO_MODE === 'true'

  return {
    plugins: [vue()],
    resolve: {
      dedupe: ['vue', 'vue-router', 'pinia'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
        shared: isMicro
          ? path.resolve(__dirname, 'src/externals')
          : path.resolve(__dirname, 'src/shared'),
        'shared-components': path.resolve(__dirname, '../shared-components/src/index.js')
      }
    },
    server: {
      port: 3001,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Headers': '*'
      },
      cors: true
    },
    build: {
      ...(isMicro && {
        rollupOptions: {
          external: [
            'vue',
            'vue-router',
            'vuex',
            'pinia',
            'ant-design-vue',
            'lodash',
            'lodash-es',
            'moment',
            'axios',
            'shared-components'
          ],
          output: {
            globals: {
              vue: 'Vue',
              'vue-router': 'VueRouter',
              vuex: 'Vuex',
              pinia: 'Pinia',
              'ant-design-vue': 'antd',
              lodash: '_',
              'lodash-es': '_',
              moment: 'moment',
              axios: 'axios',
              'shared-components': 'SharedComponents'
            }
          }
        }
      }),
      sourcemap: true
    }
  }
})
