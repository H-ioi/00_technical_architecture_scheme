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
// uni-lib：HTTP/鉴权等 + ElInputNumber 默认 `controlsPosition: 'right'`（见 `applyElementPlusPropDefaults`）
initUniLib(app)
app.use(ElementPlus)

app.use(i18n)

app.mount('#app')
