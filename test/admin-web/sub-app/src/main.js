import { createApp } from 'vue'
import { createPinia } from 'pinia'
import antd from 'ant-design-vue'
import dependencyLoader from './utils/vite-dependency-loader.js'
import App from './App.vue'
import 'ant-design-vue/dist/reset.css'

/**
 * 子应用在无界里不要用 <router-view>：RouterView 的 setup 会读 getCurrentInstance().parent
 * 在部分 iframe/沙箱时序下可能为 null，导致 vue-router 的 warnDeprecatedUsage 报错。
 * 多页需求可在稳定后再加路由，并配合 resolve.dedupe + 同一份 vue/vue-router 产物。
 */
async function setupDevMockIfNeeded() {
  if (import.meta.env.DEV && !window.__POWERED_BY_WUJIE__) {
    const { setupDevMockSharedDeps } = await import('./dev-mock-shared.js')
    await setupDevMockSharedDeps()
  }
}

let appInstance = null

async function mountApp() {
  if (appInstance) return

  await setupDevMockIfNeeded()

  const app = createApp(App)

  app.use(createPinia())
  app.use(antd)

  const sharedComponents = ['UserAvatar', 'CommonDialog', 'DataTable']
  for (const compName of sharedComponents) {
    try {
      const component = await dependencyLoader.loadComponent(compName)
      if (component) {
        app.component(compName, component)
      }
    } catch (error) {
      console.warn(`Failed to load shared component ${compName}:`, error)
    }
  }

  app.mount('#app')
  appInstance = app
}

if (window.__POWERED_BY_WUJIE__) {
  window.__WUJIE_MOUNT = () => {
    void mountApp()
  }
  window.__WUJIE_UNMOUNT = () => {
    appInstance?.unmount()
    appInstance = null
  }
} else {
  void mountApp().catch((error) => {
    console.error('Failed to bootstrap app:', error)
  })
}
