import type { Component } from 'vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { UniZhEnIcon } from 'uni-ui-lib'

/**
 * 全局侧栏/菜单 `meta.icon` 可选键 → 组件。
 *
 * - **Element Plus**：`import *` 引入 `@element-plus/icons-vue` 全量导出（与侧栏 `uni-lib` 默认表一致）。
 * - **uni-ui-lib**：扩展项写在后面对象中，同名键可覆盖 EP（当前仅 `UniZhEn`）。
 *
 * 注意：全量图标会显著增加首屏/依赖 chunk 体积；若需瘦身可改回按需导入 + 白名单。
 */
const elementPlusMenuIcons = ElementPlusIconsVue as unknown as Record<string, Component>

const uniLibMenuIcons: Record<string, Component> = {
  UniZhEn: UniZhEnIcon
}

export const menuSidebarIconMap: Record<string, Component> = {
  ...elementPlusMenuIcons,
  ...uniLibMenuIcons
}

export const menuSidebarIconNames = Object.keys(menuSidebarIconMap)
  .filter((k) => k !== 'default' && menuSidebarIconMap[k] != null)
  .sort((a, b) => a.localeCompare(b))
