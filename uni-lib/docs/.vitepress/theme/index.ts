import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn.mjs'

import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'

import UniLib from '../../../src/index'

import './style.css'

import CompDemo from './components/CompDemo.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.use(ElementPlus, { locale: zhCn })
    app.use(UniLib)
    app.component('CompDemo', CompDemo)
  }
} satisfies Theme
