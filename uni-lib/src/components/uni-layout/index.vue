<script setup lang="ts">
import { ArrowDown, Expand, Fold } from '@element-plus/icons-vue'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { UniIcon } from '@/components/uni-icon'
import { UniThemeSettings } from '@/components/uni-theme-settings'
import { useUniTagsViewController } from '@/composables/use-uni-tags-view-controller'
import { UniZhEnIcon } from '@/icons'
import { tryGetUniRuntimeConfig } from '@/runtime/config'
import { useUniI18n } from '@/locales/i18n'
import { useAppStore } from '@/stores/uni-app'
import { usePermissionStore } from '@/stores/uni-permission'
import { useUserStore } from '@/stores/uni-user'
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
import defaultLayoutLogo from '@/assets/images/logo-top.png'
import MenuTree from './components/menu-tree.vue'
import UniLayoutChangePasswordDialog from './components/change-password-dialog.vue'
import TagsView from './components/tags-view.vue'

defineOptions({
  name: 'UniLayout'
})

const props = withDefaults(
  defineProps<{
    /**
     * 为 true 时从 Pinia（permission / app / user）与 vue-router 自动接线，
     * 模板项目通常只需传 preset；logo 不传则用库内默认图。
     */
    autoWire?: boolean
    /** 自动接线时标签栏「关闭全部」等回落路径 */
    tagsFallback?: string
    /** 是否内嵌改密弹窗、主题设置（默认命令 password / theme） */
    shellDialogs?: boolean
    menus?: UniLayoutMenuRecord[]
    tags?: UniLayoutTag[]
    activePath?: string
    activeMenu?: string
    collapsed?: boolean
    sidebarWidth?: string
    /** 侧栏 Logo 地址；不传则用内置默认图；传空字符串可隐藏 */
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
    autoWire: true,
    tagsFallback: '/dashboard',
    shellDialogs: true,
    tags: () => [],
    activePath: '',
    activeMenu: undefined,
    collapsed: false,
    sidebarWidth: '220px',
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
    translate: undefined
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

const { t } = useUniI18n()
const tr: UniLayoutTranslate = (key?: string, fallback = '') => {
  if (props.translate) {
    return props.translate(key, fallback)
  }

  if (!key) {
    return fallback
  }

  const out = t(key)

  return out !== key ? out : fallback
}

/** 未传 logo 用包内默认图；传空字符串则隐藏 */
const resolvedLogo = computed(() => {
  if (props.logo === '') {
    return ''
  }

  if (props.logo) {
    return props.logo
  }

  return defaultLayoutLogo
})

const permissionStore = usePermissionStore()
const appStore = useAppStore()
const userStore = useUserStore()
const route = useRoute()
const router = useRouter()
const { tagsViewStore, viewKey, closeTag, refreshTag, closeOthers, closeAll } = useUniTagsViewController(
  router,
  route,
  { fallbackPath: props.tagsFallback }
)

const resolvedMenus = computed(() => (props.autoWire ? permissionStore.menuRoutes : props.menus ?? []))
const resolvedTags = computed(() => (props.autoWire ? tagsViewStore.visitedTags : props.tags))
const resolvedActivePath = computed(() => (props.autoWire ? route.fullPath : props.activePath))
const resolvedActiveMenuBase = computed(() =>
  props.autoWire ? String(route.meta.activeMenu || route.path) : props.activeMenu
)
const resolvedActiveMenu = computed(() => resolvedActiveMenuBase.value || resolvedActivePath.value)
const resolvedCollapsed = computed(() => (props.autoWire ? appStore.sidebarCollapsed : props.collapsed))
const resolvedSidebarWidth = computed(() => (props.autoWire ? appStore.sidebarWidth : props.sidebarWidth))
const resolvedLocale = computed(() => (props.autoWire ? appStore.locale : props.locale))

const resolvedBreadcrumbs = computed<UniLayoutBreadcrumbItem[]>(() => {
  if (!props.autoWire) {
    return props.breadcrumbs
  }

  return [
    { title: tr('common.home', 'Home'), titleKey: 'common.home' },
    {
      title: String(route.meta.title ?? ''),
      titleKey: route.meta.titleKey ? String(route.meta.titleKey) : undefined
    }
  ]
})

const resolvedUser = computed<UniLayoutUser>(() => {
  if (!props.autoWire) {
    return props.user
  }

  const roleLabel =
    userStore.profile?.roles?.[0]?.replace(/^ROLE_/, '') || tr('common.adminRole', 'Admin')

  return {
    name: userStore.profile?.name || tr('common.admin', 'Admin'),
    username: userStore.profile?.username,
    avatar: userStore.profile?.avatar,
    role: roleLabel
  }
})

const resolvedUserCommands = computed<UniLayoutUserCommand[]>(() => {
  if (!props.autoWire) {
    return props.userCommands
  }

  return [
    { label: tr('common.changePassword', 'Change password'), command: 'password' },
    { label: tr('common.themeSettings', 'Theme settings'), command: 'theme' },
    { label: tr('common.logout', 'Logout'), command: 'logout', divided: true }
  ]
})

const activeLocaleLabel = computed(
  () => props.localeOptions.find((item) => item.value === resolvedLocale.value)?.label ?? resolvedLocale.value
)
const displayName = computed(
  () => resolvedUser.value.name || resolvedUser.value.username || tr('common.admin', 'Admin')
)
const avatarText = computed(() => {
  const firstChar = Array.from(displayName.value.trim())[0] ?? 'A'

  return /[a-z]/i.test(firstChar) ? firstChar.toUpperCase() : firstChar
})

const passwordVisible = ref(false)
const themeVisible = ref(false)

const themeStorageKeyResolved = computed(
  () => tryGetUniRuntimeConfig()?.shell?.themeStorageKey ?? 'uni-lib:theme'
)
const defaultThemeResolved = computed(
  () => tryGetUniRuntimeConfig()?.shell?.defaultTheme ?? { primaryColor: '#BA8E62' }
)

const onToggleSidebar = () => {
  if (props.autoWire) {
    appStore.toggleSidebar()
  } else {
    emit('toggleSidebar')
  }
}

const onMenuSelect = (path: string) => {
  if (props.autoWire) {
    void router.push(path)
  } else {
    emit('menuSelect', path)
  }
}

const onChangeLocale = (value: string) => {
  if (props.autoWire) {
    appStore.setLocale(value)
  } else {
    emit('changeLocale', value)
  }
}

const onTagClick = (path: string) => {
  if (props.autoWire) {
    void router.push(path)
  } else {
    emit('tagClick', path)
  }
}

const onTagClose = (path: string) => {
  if (props.autoWire) {
    closeTag(path)
  } else {
    emit('tagClose', path)
  }
}

const onTagRefresh = (tag?: UniLayoutTag) => {
  if (props.autoWire) {
    refreshTag(tag)
  } else {
    emit('tagRefresh', tag)
  }
}

const onTagCloseOthers = (path?: string) => {
  if (props.autoWire) {
    closeOthers(path)
  } else {
    emit('tagCloseOthers', path)
  }
}

const onTagCloseAll = () => {
  if (props.autoWire) {
    closeAll()
  } else {
    emit('tagCloseAll')
  }
}

const handleLogout = async () => {
  await userStore.logout()
  tagsViewStore.resetTags()
  const redirect = tryGetUniRuntimeConfig()?.shell?.logoutRedirect ?? '/login'
  void router.replace(redirect)
}

const onUserCommand = (command: string) => {
  if (props.shellDialogs) {
    if (command === 'password') {
      passwordVisible.value = true
      return
    }

    if (command === 'theme') {
      themeVisible.value = true
      return
    }

    if (command === 'logout') {
      void handleLogout()
      return
    }
  }

  emit('userCommand', command)
}
</script>

<template>
  <el-container class="uni-layout" :class="`uni-layout--${preset}`" direction="horizontal">
    <slot name="sidebar">
      <el-aside class="uni-layout__sidebar" :width="resolvedCollapsed ? '64px' : resolvedSidebarWidth">
        <div class="uni-layout__brand">
          <slot name="logo">
            <img v-if="resolvedLogo" class="uni-layout__logo" :src="resolvedLogo" :alt="logoAlt" />
          </slot>
        </div>

        <el-menu
          class="uni-layout__menu"
          :collapse="resolvedCollapsed"
          :default-active="resolvedActiveMenu"
          @select="(path: string) => onMenuSelect(path)"
        >
          <MenuTree :menus="resolvedMenus" :icon-map="iconMap" :translate="tr">
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
            <el-button text @click="onToggleSidebar">
              <el-icon>
                <Fold v-if="!resolvedCollapsed" />
                <Expand v-else />
              </el-icon>
            </el-button>
            <slot name="breadcrumb">
              <el-breadcrumb separator="/">
                <el-breadcrumb-item v-for="item in resolvedBreadcrumbs" :key="item.titleKey || item.title">
                  {{ tr(item.titleKey, item.title) }}
                </el-breadcrumb-item>
              </el-breadcrumb>
            </slot>
          </div>

          <div class="uni-layout__header-right">
            <slot name="header-right">
              <el-dropdown v-if="showLocale" trigger="click" @command="(value: string) => onChangeLocale(value)">
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

              <el-dropdown
                v-if="showUser"
                trigger="click"
                popper-class="uni-layout-user-dropdown"
                @command="(command: string) => onUserCommand(command)"
              >
                <button class="uni-layout__user" type="button">
                  <span class="uni-layout__user-info">
                    <strong>{{ displayName }}</strong>
                    <small v-if="resolvedUser.role">{{ resolvedUser.role }}</small>
                  </span>
                  <el-avatar class="uni-layout__avatar" :src="resolvedUser.avatar" :size="34">
                    {{ avatarText }}
                  </el-avatar>
                  <el-icon class="uni-layout__user-arrow">
                    <ArrowDown />
                  </el-icon>
                </button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item
                      v-for="item in resolvedUserCommands"
                      :key="item.command"
                      :command="item.command"
                      :divided="item.divided"
                    >
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
          :tags="resolvedTags"
          :active-path="resolvedActivePath"
          :translate="tr"
          @click="(path) => onTagClick(path)"
          @close="(path) => onTagClose(path)"
          @refresh="(tag) => onTagRefresh(tag)"
          @close-others="(path) => onTagCloseOthers(path)"
          @close-all="onTagCloseAll()"
        />
      </slot>

      <el-main class="uni-layout__content">
        <template v-if="autoWire">
          <router-view v-slot="{ Component }">
            <component :is="Component" :key="viewKey" />
          </router-view>
        </template>
        <slot v-else />
      </el-main>
    </el-container>
  </el-container>

  <template v-if="shellDialogs">
    <UniLayoutChangePasswordDialog v-model="passwordVisible" />
    <UniThemeSettings
      v-model="themeVisible"
      :default-theme="defaultThemeResolved"
      :storage-key="themeStorageKeyResolved"
      :title="tr('common.themeSettings', 'Theme settings')"
    />
  </template>
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
