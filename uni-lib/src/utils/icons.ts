/**
 * 组件库内置图标映射：`UniLayout` 等场景中 `resolveIcon` 的回退表。
 * 合并 EP 全量与库内图标（如 `UniZhEn`）；业务可通过 `icon-map` 覆盖。纯 `.ts` 模块。
 */
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import type { Component } from 'vue'

import { UniZhEn } from '@/icons'
import type { UniLayoutIconMap } from '@/types/uni-layout'

const elementPlusIcons = ElementPlusIconsVue as unknown as Record<string, Component>

const uniLibIcons: Record<string, Component> = {
  UniZhEn
}

/** 内置图标名 → 组件（布局侧栏等 `icon` 配置解析用） */
export const uniIconMap: UniLayoutIconMap = {
  ...elementPlusIcons,
  ...uniLibIcons
}

/** 内置可选图标名列表（已排序，供选择器等使用） */
export const uniIconNames = Object.keys(uniIconMap)
  .filter((k) => k !== 'default' && uniIconMap[k] != null)
  .sort((a, b) => a.localeCompare(b))
