import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createApp } from 'vue'

import App from './App.vue'
import './assets/styles/index.scss'
import { i18n } from './locales'
import { router } from './router'
import { pinia } from './stores'
import { initUniLib } from './uni'

const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(ElementPlus)

app.use(i18n)

initUniLib(app)

app.mount('#app')
