<script setup lang="ts">
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

import type {
  UniLayoutIconMap,
  UniLayoutMenuRecord,
  UniLayoutTranslate,
} from "@/types/uni-layout";

defineOptions({
  name: "UniLayoutMenuTree",
});

withDefaults(
  defineProps<{
    menus: UniLayoutMenuRecord[];
    iconMap?: UniLayoutIconMap;
    translate?: UniLayoutTranslate;
  }>(),
  {
    iconMap: () => ({}),
    translate: (_key?: string, fallback = "") => fallback,
  },
);

const defaultIconMap: Record<string, Component> = {
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

const resolveTitle = (
  menu: UniLayoutMenuRecord,
  translate: UniLayoutTranslate,
) => translate(menu.meta.titleKey, menu.meta.title ?? menu.name ?? menu.path);

const resolveIcon = (icon: string | undefined, iconMap: UniLayoutIconMap) =>
  icon ? (iconMap[icon] ?? defaultIconMap[icon]) : undefined;
</script>

<template>
  <template v-for="menu in menus" :key="menu.path">
    <el-sub-menu v-if="menu.children?.length" :index="menu.path">
      <template #title>
        <slot name="menu-icon" :menu="menu">
          <el-icon v-if="resolveIcon(menu.meta.icon, iconMap)">
            <component :is="resolveIcon(menu.meta.icon, iconMap)" />
          </el-icon>
        </slot>
        <slot
          name="menu-title"
          :menu="menu"
          :title="resolveTitle(menu, translate)"
        >
          <span>{{ resolveTitle(menu, translate) }}</span>
        </slot>
      </template>

      <UniLayoutMenuTree
        :menus="menu.children"
        :icon-map="iconMap"
        :translate="translate"
      />
    </el-sub-menu>

    <el-menu-item v-else :index="menu.path">
      <slot name="menu-icon" :menu="menu">
        <el-icon v-if="resolveIcon(menu.meta.icon, iconMap)">
          <component :is="resolveIcon(menu.meta.icon, iconMap)" />
        </el-icon>
      </slot>
      <template #title>
        <slot
          name="menu-title"
          :menu="menu"
          :title="resolveTitle(menu, translate)"
        >
          {{ resolveTitle(menu, translate) }}
        </slot>
      </template>
    </el-menu-item>
  </template>
</template>
