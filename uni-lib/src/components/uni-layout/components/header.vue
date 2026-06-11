<template>
  <el-header class="uni-layout__header">
    <div class="uni-layout__header-left">
      <el-button text @click="emit('toggleSidebar')">
        <el-icon>
          <Fold v-if="!collapsed" />
          <Expand v-else />
        </el-icon>
      </el-button>
      <slot name="breadcrumb">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item v-for="item in breadcrumbs" :key="item.titleKey || item.title">
            {{ translate(item.titleKey, item.title) }}
          </el-breadcrumb-item>
        </el-breadcrumb>
      </slot>
    </div>

    <div class="uni-layout__header-right">
      <slot name="header-right">
        <el-dropdown
          v-if="showLocale"
          trigger="click"
          @command="(value: string) => emit('changeLocale', value)">
          <button class="uni-layout__locale uni-layout__action" type="button">
            <UniIcon class="uni-layout__locale-icon" :icon="UniZhEnIcon" :size="24" />
            {{ activeLocaleLabel }}
            <el-icon class="uni-layout__locale-arrow">
              <ArrowDown />
            </el-icon>
          </button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-for="item in localeOptions"
                :key="item.value"
                :command="item.value">
                {{ item.label }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

        <span v-if="showLocale && showUser" class="uni-layout__divider" />

        <el-dropdown
          v-if="showUser"
          trigger="click"
          popper-class="uni-layout-user-dropdown"
          @command="(command: string) => emit('userCommand', command)">
          <button class="uni-layout__user" type="button">
            <span class="uni-layout__user-info">
              <strong>{{ displayName }}</strong>
              <small v-if="user.role">{{ user.role }}</small>
            </span>
            <el-avatar class="uni-layout__avatar" :src="user.avatar" :size="34">
              {{ avatarText }}
            </el-avatar>
            <el-icon class="uni-layout__user-arrow">
              <ArrowDown />
            </el-icon>
          </button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-for="item in userCommands"
                :key="item.command"
                :command="item.command"
                :divided="item.divided">
                {{ item.label }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </slot>
    </div>
  </el-header>
</template>

<script setup lang="ts">
import { ArrowDown, Expand, Fold } from '@element-plus/icons-vue'

import { UniIcon } from '@/components/uni-icon'
import { UniZhEnIcon } from '@/icons'
import type {
  UniLayoutBreadcrumbItem,
  UniLayoutLocaleOption,
  UniLayoutTranslate,
  UniLayoutUser,
  UniLayoutUserCommand
} from '@/types/uni-layout'

defineOptions({
  name: 'HeaderBar'
})

withDefaults(
  defineProps<{
    collapsed?: boolean
    breadcrumbs?: UniLayoutBreadcrumbItem[]
    translate: UniLayoutTranslate
    showLocale?: boolean
    showUser?: boolean
    localeOptions?: UniLayoutLocaleOption[]
    activeLocaleLabel?: string
    user?: UniLayoutUser
    userCommands?: UniLayoutUserCommand[]
    displayName?: string
    avatarText?: string
  }>(),
  {
    collapsed: false,
    breadcrumbs: () => [],
    showLocale: true,
    showUser: true,
    localeOptions: () => [],
    activeLocaleLabel: '',
    user: () => ({}),
    userCommands: () => [],
    displayName: '',
    avatarText: ''
  }
)

const emit = defineEmits<{
  toggleSidebar: []
  changeLocale: [locale: string]
  userCommand: [command: string]
}>()
</script>
