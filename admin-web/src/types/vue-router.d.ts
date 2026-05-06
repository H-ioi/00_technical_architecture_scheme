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
  }
}
