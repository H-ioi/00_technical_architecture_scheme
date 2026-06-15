import type { TemplateId } from '../types.js'

/** 脚手架支持的模版定义 */
export interface TemplateOption {
  id: TemplateId
  label: string
  shortName: string
  description: string
  techStack: string
  scene: string
  dirName: string
  devCommand: string
  installCommand: string
}

export const TEMPLATE_OPTIONS: TemplateOption[] = [
  {
    id: 'admin-web',
    label: '管理后台 (admin-web)',
    shortName: '管理后台',
    description: 'Vue 3 + Vite + Element Plus + uni-ui-lib，内置权限、工作台与列表页案例',
    techStack: 'Vue 3 · Vite · TypeScript · Element Plus · Pinia · uni-ui-lib',
    scene: '运营平台、权限后台、数据看板、内部管理系统',
    dirName: 'admin-web',
    devCommand: 'npm run dev',
    installCommand: 'npm install'
  },
  {
    id: 'customer-web',
    label: 'C 端站点 (customer-web)',
    shortName: 'C 端站点',
    description: 'Nuxt 3 + Vue 3，支持 SEO 与混合渲染，适合品牌官网与内容门户',
    techStack: 'Nuxt 3 · Vue 3 · TypeScript · Sass',
    scene: '官网、商城、内容门户、会员中心',
    dirName: 'customer-web',
    devCommand: 'npm run dev',
    installCommand: 'npm install'
  },
  {
    id: 'customer-mobile',
    label: '移动端跨端 (customer-mobile)',
    shortName: '移动端',
    description: 'uni-app + Vue 3，一套代码适配 H5 与微信小程序等多端',
    techStack: 'uni-app · Vue 3 · Vite · TypeScript · Pinia · vue-i18n',
    scene: '移动门户、活动页、轻量业务、小程序',
    dirName: 'customer-mobile',
    devCommand: 'npm run dev:h5',
    installCommand: 'npm install'
  },
  {
    id: 'native-app',
    label: '原生应用 (native-app)',
    shortName: '原生应用',
    description: 'Flutter 基础骨架，面向 iOS / Android 高性能原生场景',
    techStack: 'Flutter · Dart',
    scene: '深度原生能力、复杂交互、独立 App 客户端',
    dirName: 'native-app',
    devCommand: 'flutter run',
    installCommand: 'flutter pub get'
  }
]

export function getTemplateById(id: TemplateId): TemplateOption {
  const template = TEMPLATE_OPTIONS.find((item) => item.id === id)
  if (!template) {
    throw new Error(`未知模版类型: ${id}`)
  }
  return template
}
