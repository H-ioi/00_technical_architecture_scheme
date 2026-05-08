<script setup lang="ts">
import { ArrowDown, Expand, Fold } from '@element-plus/icons-vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { UniIcon, UniZhEnIcon } from 'uni-ui-lib'
import { computed, reactive, ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'

import { changePasswordApi } from '@/api'
import { DEFAULT_THEME } from '@/config'
import { useAppI18n } from '@/composables/use-app-i18n'
import { getLocalizedDocumentTitle } from '@/locales'
import { useAppStore, useUserStore } from '@/stores'
import { storage } from '@/utils/storage'

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
const defaultTheme = DEFAULT_THEME
const passwordForm = reactive({
  password: '',
  newpassword1: '',
  newpassword2: ''
})
const avatarText = computed(() => {
  const firstChar = Array.from(displayName.value.trim())[0] ?? t('common.admin').charAt(0)

  return /[a-z]/i.test(firstChar) ? firstChar.toUpperCase() : firstChar
})
const localeLabel = computed(() => (appStore.locale === 'en' ? 'English' : '简体中文'))
const roleLabel = computed(
  () => userStore.profile?.roles?.[0]?.replace(/^ROLE_/, '') || t('common.adminRole')
)

const switchLocale = (locale: string | number | object) => {
  appStore.setLocale(locale === 'en' ? 'en' : 'zh-CN')
}

const handleUserCommand = (command: string | number | object) => {
  if (command === 'password') {
    openPasswordDialog()
    return
  }

  if (command === 'theme') {
    themeVisible.value = true
    return
  }

  if (command === 'logout') {
    emit('logout')
  }
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
        <button class="header__locale header__action" type="button">
          <UniIcon class="header__locale-icon" :icon="UniZhEnIcon" :size="24" />
          {{ localeLabel }}
          <el-icon class="header__locale-arrow">
            <ArrowDown />
          </el-icon>
        </button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="zh-CN">简体中文</el-dropdown-item>
            <el-dropdown-item command="en">English</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <span class="header__divider" />

      <el-dropdown trigger="click" popper-class="header-user-dropdown" @command="handleUserCommand">
        <button class="header__user" type="button">
          <span class="header__user-info">
            <strong>{{ displayName }}</strong>
            <small>{{ roleLabel }}</small>
          </span>
          <el-avatar class="header__avatar" :src="userStore.profile?.avatar" :size="34">
            {{ avatarText }}
          </el-avatar>
          <el-icon class="header__user-arrow">
            <ArrowDown />
          </el-icon>
        </button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="password">
              {{ t('common.changePassword') }}
            </el-dropdown-item>
            <el-dropdown-item command="theme">
              {{ t('common.themeSettings') }}
            </el-dropdown-item>
            <el-dropdown-item divided command="logout">
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
      :storage-key="storage.key('theme')"
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
    gap: 12px;
    align-items: center;
    height: 100%;
  }

  &__locale,
  &__user,
  &__icon-button {
    display: inline-flex;
    gap: 8px;
    align-items: center;
    height: 36px;
    padding: 0;
    color: var(--app-text-color);
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
  &__icon-button:hover {
    color: var(--app-primary-color);
  }

  &__locale {
    gap: 8px;
    font-size: 13px;
    font-weight: 500;
  }

  &__locale-icon {
    color: var(--app-text-color-secondary);
    transition: color 0.2s ease;
  }

  &__locale:hover &__locale-icon {
    color: var(--app-primary-color);
  }

  &__locale-arrow {
    color: var(--app-text-color-secondary);
    font-size: 12px;
  }

  &__icon-button {
    justify-content: center;
    width: 30px;
    padding: 0;
    font-size: 18px;
  }

  &__divider {
    width: 1px;
    height: 28px;
    background: var(--app-border-color);
  }

  &__user {
    gap: 8px;
    height: 44px;
  }

  &__avatar {
    color: var(--app-primary-color);
    font-size: 18px;
    font-weight: 700;
    background: var(--app-primary-color-5);
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
      color: var(--app-text-color);
      font-size: 13px;
      font-weight: 600;
      line-height: 1.1;
    }

    small {
      color: var(--app-text-color-secondary);
      font-size: 11px;
      line-height: 1.1;
    }
  }

  &__user-arrow {
    color: var(--app-text-color-secondary);
    font-size: 12px;
  }
}
</style>

<style lang="scss">
.header-user-dropdown {
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
