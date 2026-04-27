/**
 * 开发环境模拟主应用注入（对照《调研方案》第三节，用模块替代 index.html EJS）
 */
export async function setupDevMockSharedDeps() {
  if (!import.meta.env.DEV) return
  if (window.__POWERED_BY_WUJIE__) return
  if (window.__STANDALONE_DEV__) return

  const Vue = await import('vue')
  const VueRouter = await import('vue-router')
  const Pinia = await import('pinia')
  const Vuex = await import('vuex')
  const antd = (await import('ant-design-vue')).default
  const _ = (await import('lodash-es')).default
  const moment = (await import('moment')).default
  const axios = (await import('axios')).default
  const Shared = await import('shared-components')

  window.__SHARED_DEPS_FROM_MAIN = {
    libs: {
      vue: Vue,
      'vue-router': VueRouter,
      vuex: Vuex,
      pinia: Pinia,
      'ant-design-vue': antd,
      lodash: _,
      moment,
      axios
    },
    components: {
      UserAvatar: Shared.UserAvatar,
      CommonDialog: Shared.CommonDialog,
      DataTable: Shared.DataTable
    }
  }

  window.__STANDALONE_DEV__ = true
  console.log('[sub-app] Dev mock __SHARED_DEPS_FROM_MAIN initialized')
}
