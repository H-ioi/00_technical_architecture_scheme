<script setup lang="ts">
import { Expand, Fold } from '@element-plus/icons-vue'
import { computed, watchEffect } from 'vue'
import { useRoute } from 'vue-router'

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
const avatarText = computed(() => {
  const firstChar = Array.from(displayName.value.trim())[0] ?? t('common.admin').charAt(0)

  return /[a-z]/i.test(firstChar) ? firstChar.toUpperCase() : firstChar
})
const localeLabel = computed(() => (appStore.locale === 'en' ? 'English' : '中文'))

const switchLocale = (locale: string | number | object) => {
  appStore.setLocale(locale === 'en' ? 'en' : 'zh-CN')
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
            <el-dropdown-item @click="emit('logout')">{{ t('common.logout') }}</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
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
}

.header__left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header__right {
  display: flex;
  gap: 16px;
  align-items: center;
}

.header__locale,
.header__user {
  display: inline-flex;
  gap: 8px;
  align-items: center;
  color: var(--app-text-color);
  cursor: pointer;
  background: transparent;
  border: 0;
}

.header__locale {
  padding: 0;
}
</style>
