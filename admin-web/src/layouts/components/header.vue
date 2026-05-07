<script setup lang="ts">
import { Expand, Fold } from '@element-plus/icons-vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { computed, reactive, ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'

import { changePasswordApi } from '@/api'
import { useAppI18n } from '@/composables/use-app-i18n'
import { getLocalizedDocumentTitle } from '@/locales'
import { useAppStore, useUserStore } from '@/stores'

const route = useRoute()
const appStore = useAppStore()
const userStore = useUserStore()
const { t } = useAppI18n()

const emit = defineEmits<{
  logout: []
}>()

const displayName = computed(() => userStore.profile?.name || t('common.admin'))
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
const avatarText = computed(() => {
  const firstChar = Array.from(displayName.value.trim())[0] ?? t('common.admin').charAt(0)

  return /[a-z]/i.test(firstChar) ? firstChar.toUpperCase() : firstChar
})
const localeLabel = computed(() => (appStore.locale === 'en' ? 'English' : '中文'))

const switchLocale = (locale: string | number | object) => {
  appStore.setLocale(locale === 'en' ? 'en' : 'zh-CN')
}

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
    emit('logout')
  } finally {
    passwordSubmitting.value = false
  }
}

watchEffect(() => {
  document.title = getLocalizedDocumentTitle(route.meta.titleKey, route.meta.title)
})
</script>

<template>
  <el-header class="header">
    <div class="header__left">
      <el-button text @click="appStore.toggleSidebar">
        <el-icon>
          <Fold v-if="!appStore.sidebarCollapsed" />
          <Expand v-else />
        </el-icon>
      </el-button>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>{{ t('common.home') }}</el-breadcrumb-item>
        <el-breadcrumb-item>
          {{ t(String(route.meta.titleKey ?? ''), String(route.meta.title ?? '')) }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="header__right">
      <el-dropdown trigger="click" @command="switchLocale">
        <button class="header__locale" type="button">
          {{ localeLabel }}
        </button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="zh-CN">中文</el-dropdown-item>
            <el-dropdown-item command="en">English</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <el-dropdown trigger="click">
        <button class="header__user" type="button">
          <el-avatar :src="userStore.profile?.avatar" :size="32">
            {{ avatarText }}
          </el-avatar>
          <span>{{ displayName }}</span>
        </button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="openPasswordDialog">
              {{ t('common.changePassword') }}
            </el-dropdown-item>
            <el-dropdown-item @click="themeVisible = true">
              {{ t('common.themeSettings') }}
            </el-dropdown-item>
            <el-dropdown-item divided @click="emit('logout')">
              {{ t('common.logout') }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

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
      storage-key="admin-web:theme"
      :title="t('common.themeSettings')"
    />
  </el-header>
</template>

<style scoped lang="scss">
.header {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  background: var(--app-card-bg-color);
  border-bottom: 1px solid var(--app-border-color);

  &__left {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  &__right {
    display: flex;
    gap: 16px;
    align-items: center;
  }

  &__locale,
  &__user {
    display: inline-flex;
    gap: 8px;
    align-items: center;
    color: var(--app-text-color);
    cursor: pointer;
    background: transparent;
    border: 0;
  }

  &__locale {
    padding: 0;
  }

}
</style>
