<template>
  <el-container class="uni-layout" :class="`uni-layout--${preset}`" direction="horizontal">
    <slot name="sidebar">
      <SidebarPanel
        :collapsed="resolvedCollapsed"
        :sidebar-width="resolvedSidebarWidth"
        :logo="resolvedLogo"
        :logo-alt="logoAlt"
        :menus="resolvedMenus"
        :active-menu="resolvedActiveMenu"
        :icon-map="iconMap"
        :translate="tr"
        @menu-select="onMenuSelect">
        <template v-if="$slots.logo" #logo>
          <slot name="logo" />
        </template>
        <template v-if="$slots['menu-icon']" #menu-icon="slotProps">
          <slot name="menu-icon" v-bind="slotProps" />
        </template>
        <template v-if="$slots['menu-title']" #menu-title="slotProps">
          <slot name="menu-title" v-bind="slotProps" />
        </template>
      </SidebarPanel>
    </slot>

    <el-container class="uni-layout__main" direction="vertical">
      <slot name="header">
        <HeaderBar
          :collapsed="resolvedCollapsed"
          :breadcrumbs="resolvedBreadcrumbs"
          :menus="resolvedMenus"
          :translate="tr"
          :show-global-search="showGlobalSearch"
          :show-locale="showLocale"
          :show-user="showUser"
          :locale-options="localeOptions"
          :active-locale-label="activeLocaleLabel"
          :user="resolvedUser"
          :user-commands="resolvedUserCommands"
          :display-name="displayName"
          :avatar-text="avatarText"
          @toggle-sidebar="onToggleSidebar"
          @change-locale="onChangeLocale"
          @user-command="onUserCommand"
          @search-select="onSearchSelect">
          <template v-if="$slots.breadcrumb" #breadcrumb>
            <slot name="breadcrumb" />
          </template>
          <template v-if="$slots['header-search']" #header-search>
            <slot name="header-search" />
          </template>
          <template v-if="$slots['header-right']" #header-right>
            <slot name="header-right" />
          </template>
        </HeaderBar>
      </slot>

      <slot name="tags">
        <Tags
          v-if="resolvedShowTags"
          :tags="resolvedTags"
          :active-path="resolvedActivePath"
          :sync-from-route="autoWire"
          :tags-fallback="tagsFallback"
          :translate="tr"
          @click="(path) => onTagClick(path)"
          @close="(path) => onTagClose(path)"
          @refresh="(tag) => onTagRefresh(tag)"
          @close-others="(path) => onTagCloseOthers(path)"
          @close-all="onTagCloseAll()" />
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
    <PasswordDialog v-model="passwordVisible" />
    <UniThemeSettings
      v-model="themeVisible"
      :title="tr('common.themeSettings', 'Theme settings')" />
  </template>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'

import defaultLayoutLogo from '@/assets/images/logo-top.png'
import { UniThemeSettings } from '@/components/uni-theme-settings'
import { tryGetUniConfig } from '@/plugins/config'
import { useAppStore, useMenuStore, useUniTagsViewStore, useUserStore } from '@/stores'
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
import PasswordDialog from './components/password.vue'
import HeaderBar from './components/header.vue'
import SidebarPanel from './components/sidebar.vue'
import Tags from './components/tags.vue'

defineOptions({
  name: 'UniLayout'
})
const props = withDefaults(
  defineProps<{
    autoWire?: boolean
    tagsFallback?: string
    shellDialogs?: boolean
    menus?: UniLayoutMenuRecord[]
    tags?: UniLayoutTag[]
    activePath?: string
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
    showGlobalSearch?: boolean
    showLocale?: boolean
    showUser?: boolean
    preset?: 'default' | 'isa-light' | 'ems-dark' | 'mas-dark'
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
    showGlobalSearch: true,
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
  searchSelect: [path: string]
}>()

const { t, locale: globalLocale } = useI18n({
  useScope: 'global'
})
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

const resolvedLogo = computed(() => {
  if (props.logo === '') {
    return ''
  }

  if (props.logo) {
    return props.logo
  }

  return defaultLayoutLogo
})

const menuStore = useMenuStore()
const appStore = useAppStore()
const userStore = useUserStore()
const tagsViewStore = useUniTagsViewStore()
const route = useRoute()
const router = useRouter()

const viewKey = computed(() => `${route?.fullPath ?? ''}-${tagsViewStore.refreshKey}`)

const findVisitedTagNeighbor = (path: string) => {
  const tags = tagsViewStore.visitedTags
  const index = tags.findIndex((tag) => tag.path === path)
  const left = index > 0 ? tags[index - 1] : undefined
  const right = index < tags.length - 1 ? tags[index + 1] : undefined

  return left || right || tagsViewStore.visitedTags[tagsViewStore.visitedTags.length - 1]
}

const closeTag = (path: string) => {
  const isActive = route?.fullPath === path
  const nextTag = findVisitedTagNeighbor(path)

  tagsViewStore.removeTag(path)

  if (!isActive) {
    return
  }

  void router.push((nextTag || { path: props.tagsFallback }).path)
}

const refreshTag = (tag?: UniLayoutTag) => {
  if (tag && tag.path !== route?.fullPath) {
    void router.push(tag.path)
  }
  tagsViewStore.refreshCurrentTag()
}

const closeOthers = (path = route?.fullPath ?? '') => {
  tagsViewStore.removeOtherTags(path)

  if (path !== route?.fullPath) {
    void router.push(path)
  }
}

const closeAll = () => {
  tagsViewStore.removeAllTags()
  void router.push(props.tagsFallback)
}

const resolvedMenus = computed(() => (props.autoWire ? menuStore.menuRoutes : (props.menus ?? [])))
const resolvedTags = computed(() => (props.autoWire ? tagsViewStore.visitedTags : props.tags))
const resolvedActivePath = computed(() =>
  props.autoWire ? (route?.fullPath ?? props.activePath) : props.activePath
)
const resolvedActiveMenuBase = computed(() =>
  props.autoWire ? String(route?.meta?.activeMenu ?? route?.path ?? '') : props.activeMenu
)
const resolvedActiveMenu = computed(() => resolvedActiveMenuBase.value || resolvedActivePath.value)
const resolvedCollapsed = computed(() =>
  props.autoWire ? appStore.sidebarCollapsed : props.collapsed
)
const resolvedShowTags = computed(() => (props.autoWire ? appStore.showTags : props.showTags))
const resolvedSidebarWidth = computed(() =>
  props.autoWire ? appStore.sidebarWidth : props.sidebarWidth
)
const resolvedLocale = computed(() => (props.autoWire ? String(globalLocale.value) : props.locale))

const resolvedBreadcrumbs = computed<UniLayoutBreadcrumbItem[]>(() => {
  if (!props.autoWire) {
    return props.breadcrumbs
  }

  return [
    { title: tr('common.home', 'Home'), titleKey: 'common.home' },
    {
      title: String(route?.meta?.title ?? ''),
      titleKey: route?.meta?.titleKey != null ? String(route?.meta?.titleKey) : undefined
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
    {
      label: tr('common.changePassword', 'Change password'),
      command: 'password'
    },
    { label: tr('common.themeSettings', 'Theme settings'), command: 'theme' },
    { label: tr('common.logout', 'Logout'), command: 'logout', divided: true }
  ]
})

const activeLocaleLabel = computed(
  () =>
    props.localeOptions.find((item) => item.value === resolvedLocale.value)?.label ??
    resolvedLocale.value
)
const displayName = computed(
  () => resolvedUser.value.name || resolvedUser.value.username || tr('common.admin', 'Admin')
)
const avatarText = computed(() => {
  const firstChar = Array.from(displayName.value.trim())[0] ?? 'A'

  return /[a-z]/i.test(firstChar) ? firstChar.toUpperCase() : firstChar
})

const passwordVisible = ref(false),
  themeVisible = ref(false)

watch(
  () => [appStore.frameworkLayout, props.preset] as const,
  ([storedLayout, preset]) => {
    if (typeof document !== 'undefined') {
      document.documentElement.dataset.layout = storedLayout || preset
    }
  },
  { immediate: true }
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

const onSearchSelect = (path: string) => {
  if (props.autoWire) {
    void router.push(path)
  } else {
    emit('searchSelect', path)
  }
}

const onChangeLocale = (value: string) => {
  if (props.autoWire) {
    appStore.setLocale(value)
    globalLocale.value = value
    document.documentElement.lang = value
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
  const redirect = tryGetUniConfig()?.shell?.logoutRedirect ?? '/login'
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
