import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createApp } from 'vue'

import App from './App.vue'
import { setupDirectives } from './directives'
import { setupPlugins } from './plugins'
import { router } from './router'
import { setupRouterGuards } from './router/guards'
import { pinia } from './stores'
import './assets/styles/index.scss'

const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(ElementPlus)

setupDirectives(app)
setupPlugins(app)
setupRouterGuards(router)

app.mount('#app')
