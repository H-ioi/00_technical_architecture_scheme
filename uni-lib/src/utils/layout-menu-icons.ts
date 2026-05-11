/**
 * 侧栏菜单 `resolveIcon` 使用的默认图标（与 `MenuTree` 一致）。
 * 应用可通过 `UniLayout` 的 `icon-map` 扩展；此处导出名称为表单侧「系统内置可选」列表。
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

import type { UniLayoutIconMap } from "@/types/uni-layout";

export const uniLayoutDefaultMenuIconMap: UniLayoutIconMap = {
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

export const uniLayoutDefaultMenuIconNames = Object.keys(
  uniLayoutDefaultMenuIconMap,
).sort();
