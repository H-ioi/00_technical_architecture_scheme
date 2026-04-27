/**
 * Vite 环境下的智能依赖加载器（对照《调研方案》实现，并修正文档中的动态 import 笔误）
 */
class ViteDependencyLoader {
  constructor() {
    this.isMicro = !!window.__POWERED_BY_WUJIE__ || import.meta.env.VITE_MICRO_MODE === 'true'
    this.isDev = import.meta.env.DEV
    this.sharedFromMain = window.__SHARED_DEPS_FROM_MAIN
  }

  async loadLibrary(libName) {
    if (this.isDev && this.sharedFromMain?.libs?.[libName]) {
      console.log(`[Dev Mode] Loading ${libName} from mock shared deps`)
      return this.sharedFromMain.libs[libName]
    }

    if (this.isMicro && this.sharedFromMain?.libs?.[libName]) {
      console.log(`[Micro Mode] Loading ${libName} from main app`)
      return this.sharedFromMain.libs[libName]
    }

    console.log(`[Standalone Mode] Loading ${libName} dynamically`)

    // 子应用入口已对 pinia / ant-design-vue 做静态 import；这里不再为它们做动态 import，避免多分包。
    // 子应用已去掉路由；若你恢复 vue-router，请用静态 import 或补回下面对应的 entry。
    const libMap = {
      vue: () => import('vue'),
      vuex: () => import('vuex'),
      lodash: () => import('lodash-es'),
      moment: () => import('moment'),
      axios: () => import('axios')
    }

    if (libMap[libName]) {
      try {
        const module = await libMap[libName]()
        return module?.default ?? module
      } catch (error) {
        console.error(`Failed to load ${libName}:`, error)
        throw error
      }
    }

    const globalLibs = {
      vue: window.Vue,
      'vue-router': window.VueRouter,
      vuex: window.Vuex,
      pinia: window.Pinia,
      'ant-design-vue': window.antd,
      lodash: window._,
      moment: window.moment,
      axios: window.axios
    }

    if (globalLibs[libName]) {
      console.log(`[Global] Loading ${libName} from window`)
      return globalLibs[libName]
    }

    throw new Error(`Library ${libName} not found`)
  }

  async loadComponent(componentName) {
    if (this.isMicro && this.sharedFromMain?.components?.[componentName]) {
      return this.sharedFromMain.components[componentName]
    }

    try {
      const module = await import('@/shared/components.js')
      if (module[componentName]) {
        return module[componentName]
      }
    } catch (error) {
      console.warn('[sub-app] load local shared components failed:', error)
    }

    if (window.SharedComponents && window.SharedComponents[componentName]) {
      return window.SharedComponents[componentName]
    }

    throw new Error(`Component ${componentName} not found`)
  }

  async installVuePlugins(app, plugins) {
    for (const plugin of plugins) {
      if (typeof plugin === 'string') {
        const lib = await this.loadLibrary(plugin)
        if (lib && lib.install) {
          app.use(lib)
        }
      } else if (Array.isArray(plugin)) {
        const [libName, options] = plugin
        const lib = await this.loadLibrary(libName)
        if (lib && lib.install) {
          app.use(lib, options)
        }
      } else if (typeof plugin === 'function') {
        plugin(app)
      }
    }
  }
}

export default new ViteDependencyLoader()
