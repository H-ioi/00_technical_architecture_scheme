/**
 * 侧栏菜单 `resolveIcon` 使用的默认图标（与 `MenuTree` 一致）。
 * 应用可通过 `UniLayout` 的 `icon-map` 扩展。
 *
 * **Element Plus**：全量 `@element-plus/icons-vue`（与 admin `menu-sidebar-icon/registry` 一致）。
 * **组件库**：`UniZhEnIcon` 等置于后合并对象。全量导入会增加使用方打包体积。
 */
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import type { Component } from "vue";

import { UniZhEnIcon } from "@/icons";
import type { UniLayoutIconMap } from "@/types/uni-layout";

const elementPlusMenuIcons = ElementPlusIconsVue as unknown as Record<
  string,
  Component
>;

const uniLibMenuIcons: Record<string, Component> = {
  UniZhEn: UniZhEnIcon,
};

export const uniLayoutDefaultMenuIconMap: UniLayoutIconMap = {
  ...elementPlusMenuIcons,
  ...uniLibMenuIcons,
};

export const uniLayoutDefaultMenuIconNames = Object.keys(
  uniLayoutDefaultMenuIconMap,
)
  .filter((k) => k !== "default" && uniLayoutDefaultMenuIconMap[k] != null)
  .sort((a, b) => a.localeCompare(b));
