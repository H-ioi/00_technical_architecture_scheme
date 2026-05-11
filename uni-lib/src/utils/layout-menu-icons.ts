/**
 * 侧栏菜单 `resolveIcon` 使用的默认图标（与 `MenuTree` 一致）。
 * 应用可通过 `UniLayout` 的 `icon-map` 扩展；此处导出名称为表单侧「系统内置可选」列表。
 *
 * 融合：`@element-plus/icons-vue` + 组件库 `icons/` 生成的 SFC（与 admin `menu-sidebar-icons` 对齐）。
 */
import {
  Calendar,
  Document,
  EditPen,
  House,
  Lock,
  Message,
  Setting,
  User,
  Van,
} from "@element-plus/icons-vue";
import type { Component } from "vue";

import { UniZhEnIcon } from "@/icons";
import type { UniLayoutIconMap } from "@/types/uni-layout";

const elementPlusMenuIcons: Record<string, Component> = {
  Calendar,
  Document,
  EditPen,
  House,
  Lock,
  Message,
  Setting,
  User,
  Van,
};

const uniLibMenuIcons: Record<string, Component> = {
  UniZhEn: UniZhEnIcon,
};

export const uniLayoutDefaultMenuIconMap: UniLayoutIconMap = {
  ...elementPlusMenuIcons,
  ...uniLibMenuIcons,
};

export const uniLayoutDefaultMenuIconNames = Object.keys(
  uniLayoutDefaultMenuIconMap,
).sort();
