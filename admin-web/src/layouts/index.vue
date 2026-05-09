<script setup lang="ts">
import { ElMessage } from 'element-plus'
import {
  type UniLayoutChangePasswordPayload,
  UniLayout,
  UniLayoutChangePasswordDialog,
  UniThemeSettings,
  useUniTagsViewController
} from 'uni-ui-lib'
import { computed, ref, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { changePasswordApi } from '@/api'
import logoUrl from '@/assets/images/logo-top.png'
import { useAppI18n } from '@/composables/use-app-i18n'
import { getLocalizedDocumentTitle } from '@/locales'
import { useAppStore, usePermissionStore, useUserStore } from '@/stores'
import { storage } from '@/utils/storage'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const permissionStore = usePermissionStore()
const {
  tagsViewStore,
  viewKey,
  closeTag,
  refreshTag,
  closeOthers,
  closeAll
} = useUniTagsViewController(router, route, { fallbackPath: '/dashboard' })
const userStore = useUserStore()
const { t } = useAppI18n()
const passwordVisible = ref(false)
const themeVisible = ref(false)
const passwordSubmitting = ref(false)
const defaultTheme = {
  primaryColor: '#BA8E62'
}
const activeMenu = computed(() => String(route.meta.activeMenu || route.path))
const roleLabel = computed(
  () => userStore.profile?.roles?.[0]?.replace(/^ROLE_/, '') || t('common.adminRole')
)
const layoutUser = computed(() => ({
  name: userStore.profile?.name || t('common.admin'),
  username: userStore.profile?.username,
  avatar: userStore.profile?.avatar,
  role: roleLabel.value
}))
const breadcrumbs = computed(() => [
  { title: t('common.home'), titleKey: 'common.home' },
  {
    title: String(route.meta.title ?? ''),
    titleKey: route.meta.titleKey ? String(route.meta.titleKey) : undefined
  }
])
const userCommands = computed(() => [
  { label: t('common.changePassword'), command: 'password' },
  { label: t('common.themeSettings'), command: 'theme' },
  { label: t('common.logout'), command: 'logout', divided: true }
])
const translateLayoutText = (key?: string, fallback = '') => (key ? t(key, fallback) : fallback)

const handleLogout = async () => {
  await userStore.logout()
  permissionStore.resetPermission()
  tagsViewStore.resetTags()
  router.replace('/login')
}

const submitPasswordPayload = async (payload: UniLayoutChangePasswordPayload) => {
  passwordSubmitting.value = true

  try {
    await changePasswordApi({
      username: userStore.profile?.username || userStore.profile?.name || '',
      ...payload
    })
    ElMessage.success(t('common.passwordChanged'))
    passwordVisible.value = false
    await handleLogout()
  } finally {
    passwordSubmitting.value = false
  }
}

const handleUserCommand = (command: string) => {
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
  }
}

watchEffect(() => {
  document.title = getLocalizedDocumentTitle(route.meta.titleKey, route.meta.title)
})
</script>

<template>
  <UniLayout
    preset="isa-light"
    :menus="permissionStore.menuRoutes"
    :tags="tagsViewStore.visitedTags"
    :active-path="route.fullPath"
    :active-menu="activeMenu"
    :collapsed="appStore.sidebarCollapsed"
    :sidebar-width="appStore.sidebarWidth"
    :logo="logoUrl"
    :locale="appStore.locale"
    :user="layoutUser"
    :user-commands="userCommands"
    :breadcrumbs="breadcrumbs"
    :translate="translateLayoutText"
    @toggle-sidebar="appStore.toggleSidebar"
    @menu-select="(path) => router.push(path)"
    @change-locale="(locale) => appStore.setLocale(locale === 'en' ? 'en' : 'zh-CN')"
    @user-command="handleUserCommand"
    @tag-click="(path) => router.push(path)"
    @tag-close="closeTag"
    @tag-refresh="refreshTag"
    @tag-close-others="closeOthers"
    @tag-close-all="closeAll"
  >
    <RouterView :key="viewKey" />
  </UniLayout>

  <UniLayoutChangePasswordDialog
    v-model="passwordVisible"
    :loading="passwordSubmitting"
    @submit="submitPasswordPayload"
  />

  <UniThemeSettings
    v-model="themeVisible"
    :default-theme="defaultTheme"
    :storage-key="storage.key('theme')"
    :title="t('common.themeSettings')"
  />
</template>
