import type { Component } from 'vue'
import {
  Calendar,
  Document,
  EditPen,
  House,
  Lock,
  Message,
  Setting,
  User,
  Van
} from '@element-plus/icons-vue'
import { UniZhEnIcon } from 'uni-ui-lib'

/**
 * 全局侧栏/菜单 `meta.icon` 可选键 → 组件（与 `uni-lib/src/utils/layout-menu-icons.ts` 保持同步）。
 * 仅被同目录展示、选择组件引用。
 */
const elementPlusMenuIcons: Record<string, Component> = {
  Calendar,
  Document,
  EditPen,
  House,
  Lock,
  Message,
  Setting,
  User,
  Van
}

const uniLibMenuIcons: Record<string, Component> = {
  UniZhEn: UniZhEnIcon
}

export const menuSidebarIconMap: Record<string, Component> = {
  ...elementPlusMenuIcons,
  ...uniLibMenuIcons
}

export const menuSidebarIconNames = Object.keys(menuSidebarIconMap).sort()
