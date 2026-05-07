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
  Van
} from '@element-plus/icons-vue'
import type { Component } from 'vue'

import { useAppI18n } from '@/composables/use-app-i18n'
import type { AppMenuRecord } from '@/types/route'

defineOptions({
  name: 'LayoutMenuTree'
})

defineProps<{
  menus: AppMenuRecord[]
}>()

const { t } = useAppI18n()

const iconMap: Record<string, Component> = {
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

const resolveTitle = (menu: AppMenuRecord) => t(menu.meta.titleKey ?? '', menu.meta.title)
const resolveIcon = (icon?: string) => (icon ? iconMap[icon] : undefined)
</script>

<template>
  <template v-for="menu in menus" :key="menu.path">
    <el-sub-menu v-if="menu.children?.length" :index="menu.path">
      <template #title>
        <el-icon v-if="resolveIcon(menu.meta.icon)">
          <component :is="resolveIcon(menu.meta.icon)" />
        </el-icon>
        <span>{{ resolveTitle(menu) }}</span>
      </template>

      <LayoutMenuTree :menus="menu.children" />
    </el-sub-menu>

    <el-menu-item v-else :index="menu.path">
      <el-icon v-if="resolveIcon(menu.meta.icon)">
        <component :is="resolveIcon(menu.meta.icon)" />
      </el-icon>
      <template #title>{{ resolveTitle(menu) }}</template>
    </el-menu-item>
  </template>
</template>
