<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { UniLayout, UniThemeSettings, type UniLayoutTag } from 'uni-ui-lib'
import { computed, reactive, ref, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { changePasswordApi } from '@/api'
import logoUrl from '@/assets/images/logo-top.png'
import { useAppI18n } from '@/composables/use-app-i18n'
import { getLocalizedDocumentTitle } from '@/locales'
import { useAppStore, usePermissionStore, useTagsViewStore, useUserStore } from '@/stores'
import { storage } from '@/utils/storage'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const permissionStore = usePermissionStore()
const tagsViewStore = useTagsViewStore()
const userStore = useUserStore()
const { t } = useAppI18n()
const passwordFormRef = ref<FormInstance>()
const passwordVisible = ref(false)
const themeVisible = ref(false)
const passwordSubmitting = ref(false)
const defaultTheme = {
  primaryColor: '#BA8E62'
}
const passwordForm = reactive({
  password: '',
  newpassword1: '',
  newpassword2: ''
})
const viewKey = computed(() => `${route.fullPath}-${tagsViewStore.refreshKey}`)
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

const passwordRules = computed<FormRules<typeof passwordForm>>(() => ({
  password: [
    { required: true, message: t('common.oldPassword'), trigger: 'blur' },
    { min: 6, message: t('common.passwordMinLength'), trigger: 'blur' }
  ],
  newpassword1: [
    { required: true, message: t('common.newPassword'), trigger: 'blur' },
    { min: 6, message: t('common.passwordMinLength'), trigger: 'blur' }
  ],
  newpassword2: [
    { required: true, message: t('common.confirmPassword'), trigger: 'blur' },
    {
      validator: (_rule, value, callback) => {
        if (value !== passwordForm.newpassword1) {
          callback(new Error(t('common.passwordMismatch')))
          return
        }

        callback()
      },
      trigger: 'blur'
    }
  ]
}))

const handleLogout = async () => {
  await userStore.logout()
  permissionStore.resetPermission()
  tagsViewStore.resetTags()
  router.replace('/login')
}

const resetPasswordForm = () => {
  passwordForm.password = ''
  passwordForm.newpassword1 = ''
  passwordForm.newpassword2 = ''
  passwordFormRef.value?.clearValidate()
}

const openPasswordDialog = () => {
  passwordVisible.value = true
  resetPasswordForm()
}

const submitPassword = async () => {
  const valid = await passwordFormRef.value?.validate().catch(() => false)

  if (!valid) {
    return
  }

  passwordSubmitting.value = true

  try {
    await changePasswordApi({
      username: userStore.profile?.username || userStore.profile?.name || '',
      ...passwordForm
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
    openPasswordDialog()
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

const findNextTag = (path: string) => {
  const tags = tagsViewStore.visitedTags
  const index = tags.findIndex((tag) => tag.path === path)
  const left = index > 0 ? tags[index - 1] : undefined
  const right = index < tags.length - 1 ? tags[index + 1] : undefined

  return left || right || tagsViewStore.visitedTags[tagsViewStore.visitedTags.length - 1]
}

const closeTag = (path: string) => {
  const isActive = route.fullPath === path
  const nextTag = findNextTag(path)

  tagsViewStore.removeTag(path)

  if (!isActive) {
    return
  }

  void router.push((nextTag || { path: '/dashboard' }).path)
}

const refreshTag = (tag?: UniLayoutTag) => {
  if (tag && tag.path !== route.fullPath) {
    void router.push(tag.path)
  }
  tagsViewStore.refreshCurrentTag()
}

const closeOthers = (path = route.fullPath) => {
  tagsViewStore.removeOtherTags(path)

  if (path !== route.fullPath) {
    void router.push(path)
  }
}

const closeAll = () => {
  tagsViewStore.removeAllTags()
  void router.push('/dashboard')
}

// UniLayout 只负责 UI 事件，项目适配层在这里接入当前路由、权限菜单和业务状态。
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

  <el-dialog
    v-model="passwordVisible"
    :title="t('common.changePassword')"
    width="420px"
    destroy-on-close
  >
    <el-form
      ref="passwordFormRef"
      :model="passwordForm"
      :rules="passwordRules"
      label-position="top"
    >
      <el-form-item :label="t('common.oldPassword')" prop="password">
        <el-input v-model="passwordForm.password" type="password" show-password />
      </el-form-item>
      <el-form-item :label="t('common.newPassword')" prop="newpassword1">
        <el-input v-model="passwordForm.newpassword1" type="password" show-password />
      </el-form-item>
      <el-form-item :label="t('common.confirmPassword')" prop="newpassword2">
        <el-input v-model="passwordForm.newpassword2" type="password" show-password />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="resetPasswordForm">{{ t('common.reset') }}</el-button>
      <el-button @click="passwordVisible = false">{{ t('common.cancel') }}</el-button>
      <el-button type="primary" :loading="passwordSubmitting" @click="submitPassword">
        {{ t('common.submit') }}
      </el-button>
    </template>
  </el-dialog>

  <UniThemeSettings
    v-model="themeVisible"
    :default-theme="defaultTheme"
    :storage-key="storage.key('theme')"
    :title="t('common.themeSettings')"
  />
</template>
