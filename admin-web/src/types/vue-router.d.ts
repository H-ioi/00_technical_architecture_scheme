import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    titleKey?: string
    icon?: string
    hidden?: boolean
    keepAlive?: boolean
    affix?: boolean
    permission?: string[]
    activeMenu?: string
    /** 标签栏：用该路由参数区分多个详情 tab（如 `id`） */
    tagDetailParam?: string
  }
}
