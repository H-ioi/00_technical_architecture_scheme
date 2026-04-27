import { createApp } from 'vue'
import App from './App.vue'
import sharedDeps from './shared-deps/index.js'
import antd from 'ant-design-vue'
import WujieVue from 'wujie-vue3'
import 'ant-design-vue/dist/reset.css'

const app = createApp(App)

app.use(antd)
app.use(WujieVue)

sharedDeps.init()

Object.entries(sharedDeps.deps.components).forEach(([name, component]) => {
  if (name === 'default') return
  if (component && (typeof component === 'object' || typeof component === 'function')) {
    app.component(name, component)
  }
})

app.mount('#app')
