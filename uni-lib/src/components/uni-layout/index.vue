<script setup lang="ts">
import { ArrowDown, Expand, Fold } from '@element-plus/icons-vue'
import { computed } from 'vue'

import { UniIcon } from '@/components/uni-icon'
import { UniZhEnIcon } from '@/icons'

import type {
  UniLayoutBreadcrumbItem,
  UniLayoutIconMap,
  UniLayoutLocaleOption,
  UniLayoutMenuRecord,
  UniLayoutTag,
  UniLayoutTranslate,
  UniLayoutUser,
  UniLayoutUserCommand
} from '@/types/uni-layout'
import MenuTree from './components/menu-tree.vue'
import TagsView from './components/tags-view.vue'

defineOptions({
  name: 'UniLayout'
})

const props = withDefaults(
  defineProps<{
    menus: UniLayoutMenuRecord[]
    tags?: UniLayoutTag[]
    activePath: string
    activeMenu?: string
    collapsed?: boolean
    sidebarWidth?: string
    logo?: string
    logoAlt?: string
    locale?: string
    localeOptions?: UniLayoutLocaleOption[]
    user?: UniLayoutUser
    userCommands?: UniLayoutUserCommand[]
    breadcrumbs?: UniLayoutBreadcrumbItem[]
    showTags?: boolean
    showLocale?: boolean
    showUser?: boolean
    preset?: 'default' | 'isa-light' | 'custom'
    iconMap?: UniLayoutIconMap
    translate?: UniLayoutTranslate
  }>(),
  {
    tags: () => [],
    activeMenu: undefined,
    collapsed: false,
    sidebarWidth: '220px',
    logo: '',
    logoAlt: 'logo',
    locale: 'zh-CN',
    localeOptions: () => [
      { label: '简体中文', value: 'zh-CN' },
      { label: 'English', value: 'en' }
    ],
    user: () => ({}),
    userCommands: () => [],
    breadcrumbs: () => [],
    showTags: true,
    showLocale: true,
    showUser: true,
    preset: 'default',
    iconMap: () => ({}),
    translate: (_key?: string, fallback = '') => fallback
  }
)

const emit = defineEmits<{
  toggleSidebar: []
  menuSelect: [path: string]
  changeLocale: [locale: string]
  userCommand: [command: string]
  tagClick: [path: string]
  tagClose: [path: string]
  tagRefresh: [tag?: UniLayoutTag]
  tagCloseOthers: [path?: string]
  tagCloseAll: []
}>()

const resolvedActiveMenu = computed(() => props.activeMenu || props.activePath)
const activeLocaleLabel = computed(() => props.localeOptions.find((item) => item.value === props.locale)?.label ?? props.locale)
const displayName = computed(() => props.user.name || props.user.username || props.translate('common.admin', 'Admin'))
const avatarText = computed(() => {
  const firstChar = Array.from(displayName.value.trim())[0] ?? 'A'

  return /[a-z]/i.test(firstChar) ? firstChar.toUpperCase() : firstChar
})
</script>

<template>
  <el-container class="uni-layout" :class="`uni-layout--${preset}`" direction="horizontal">
    <slot name="sidebar">
      <el-aside class="uni-layout__sidebar" :width="collapsed ? '64px' : sidebarWidth">
        <div class="uni-layout__brand">
          <slot name="logo">
            <img v-if="logo" class="uni-layout__logo" :src="logo" :alt="logoAlt" />
          </slot>
        </div>

        <el-menu class="uni-layout__menu" :collapse="collapsed" :default-active="resolvedActiveMenu" @select="(path: string) => emit('menuSelect', path)">
          <MenuTree :menus="menus" :icon-map="iconMap" :translate="translate">
            <template #menu-icon="slotProps">
              <slot name="menu-icon" v-bind="slotProps" />
            </template>
            <template #menu-title="slotProps">
              <slot name="menu-title" v-bind="slotProps" />
            </template>
          </MenuTree>
        </el-menu>
      </el-aside>
    </slot>

    <el-container class="uni-layout__main" direction="vertical">
      <slot name="header">
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
              <el-dropdown v-if="showLocale" trigger="click" @command="(value: string) => emit('changeLocale', value)">
                <button class="uni-layout__locale uni-layout__action" type="button">
                  <UniIcon class="uni-layout__locale-icon" :icon="UniZhEnIcon" :size="24" />
                  {{ activeLocaleLabel }}
                  <el-icon class="uni-layout__locale-arrow">
                    <ArrowDown />
                  </el-icon>
                </button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item v-for="item in localeOptions" :key="item.value" :command="item.value">
                      {{ item.label }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>

              <span v-if="showLocale && showUser" class="uni-layout__divider" />

              <el-dropdown v-if="showUser" trigger="click" popper-class="uni-layout-user-dropdown" @command="(command: string) => emit('userCommand', command)">
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
                    <el-dropdown-item v-for="item in userCommands" :key="item.command" :command="item.command" :divided="item.divided">
                      {{ item.label }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </slot>
          </div>
        </el-header>
      </slot>

      <slot name="tags">
        <TagsView
          v-if="showTags"
          :tags="tags"
          :active-path="activePath"
          :translate="translate"
          @click="(path) => emit('tagClick', path)"
          @close="(path) => emit('tagClose', path)"
          @refresh="(tag) => emit('tagRefresh', tag)"
          @close-others="(path) => emit('tagCloseOthers', path)"
          @close-all="emit('tagCloseAll')" />
      </slot>

      <el-main class="uni-layout__content">
        <slot />
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped lang="scss">
.uni-layout {
  width: 100%;
  height: 100vh;
  max-height: 100vh;
  overflow: hidden;
  background: var(--uni-layout-bg);

  &__sidebar {
    overflow: hidden;
    background: var(--uni-layout-sidebar-bg);
    border-right: 1px solid var(--uni-layout-border);
    transition: width 0.2s ease;
  }

  &__brand {
    display: flex;
    align-items: center;
    justify-content: center;
    height: var(--uni-layout-header-height);
    padding: 0 12px;
    overflow: hidden;
  }

  &__logo {
    display: block;
    max-width: 100%;
    height: 28px;
    object-fit: contain;
  }

  &__menu {
    border-right: 0;

    :deep(.el-menu-item.is-active) {
      color: var(--uni-layout-menu-active-color);
      background: var(--uni-layout-menu-active-bg);
    }
  }

  &__main {
    flex: 1;
    min-width: 0;
    min-height: 0;
    overflow: hidden;
  }

  &__header {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: space-between;
    height: var(--uni-layout-header-height);
    background: var(--uni-layout-card-bg);
    border-bottom: 1px solid var(--uni-layout-border);
  }

  &__header-left,
  &__header-right {
    display: flex;
    align-items: center;
  }

  &__header-left {
    gap: 12px;
  }

  &__header-right {
    gap: 12px;
    height: 100%;
  }

  &__locale,
  &__user,
  &__action {
    display: inline-flex;
    gap: 8px;
    align-items: center;
    height: 36px;
    padding: 0;
    color: var(--uni-layout-text);
    cursor: pointer;
    background: transparent;
    border: 0;
    border-radius: 8px;
    transition:
      color 0.2s ease,
      background-color 0.2s ease;
  }

  &__locale:hover,
  &__user:hover,
  &__action:hover {
    color: var(--uni-layout-primary);
  }

  &__locale {
    font-size: 13px;
    font-weight: 500;
  }

  &__locale-icon,
  &__locale-arrow,
  &__user-arrow {
    color: var(--uni-layout-text-secondary);
    transition: color 0.2s ease;
  }

  &__locale:hover &__locale-icon {
    color: var(--uni-layout-primary);
  }

  &__locale-arrow,
  &__user-arrow {
    font-size: 12px;
  }

  &__divider {
    width: 1px;
    height: 28px;
    background: var(--uni-layout-border);
  }

  &__user {
    height: 44px;
  }

  &__avatar {
    color: var(--uni-layout-primary);
    font-size: 18px;
    font-weight: 700;
    background: var(--uni-layout-primary-light);
    box-shadow: 0 12px 28px rgb(108 92 231 / 18%);
  }

  &__user-info {
    display: grid;
    gap: 2px;
    min-width: 0;
    text-align: left;

    strong,
    small {
      max-width: 96px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    strong {
      color: var(--uni-layout-text);
      font-size: 13px;
      font-weight: 600;
      line-height: 1.1;
    }

    small {
      color: var(--uni-layout-text-secondary);
      font-size: 11px;
      line-height: 1.1;
    }
  }

  &__content {
    flex: 1;
    width: 100%;
    min-width: 0;
    min-height: 0;
    padding: var(--uni-layout-content-padding);
    overflow-x: hidden;
    overflow-y: auto;
  }
}
</style>

<style lang="scss">
/** Teleport 下拉挂载在 body，需全局类名 */
.uni-layout-user-dropdown {
  min-width: 112px;

  .el-dropdown-menu {
    padding: 6px;
  }

  .el-dropdown-menu__item {
    justify-content: center;
    border-radius: 6px;
    font-size: 13px;
  }
}
</style>
