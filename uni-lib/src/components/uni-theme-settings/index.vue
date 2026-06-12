<template>
  <el-drawer v-model="visible" class="uni-theme-settings" :title="title" size="480px">
    <div class="uni-theme-settings__group">
      <div class="uni-theme-settings__row">
        <span>黑夜模式</span>
        <el-switch v-model="darkModeValue" />
      </div>

      <div class="uni-theme-settings__row">
        <span>框架布局</span>
        <el-select v-model="layoutValue" class="uni-theme-settings__select">
          <el-option label="经典" value="default" />
          <el-option label="ISA 浅色" value="isa-light" />
          <el-option label="EMS 深色" value="ems-dark" />
          <el-option label="MAS 深色" value="mas-dark" />
        </el-select>
      </div>

      <div class="uni-theme-settings__row">
        <span>折叠菜单</span>
        <el-switch v-model="sidebarCollapsedValue" />
      </div>

      <div class="uni-theme-settings__row">
        <span>标签栏</span>
        <el-switch v-model="showTagsValue" />
      </div>
    </div>

    <div class="uni-theme-settings__group">
      <div class="uni-theme-settings__row">
        <span>国际化</span>
        <el-segmented
          v-model="localeValue"
          :options="[
            { label: '简体中文', value: 'zh-CN' },
            { label: 'English', value: 'en' }
          ]" />
      </div>
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import { useAppStore } from '@/stores'

defineOptions({
  name: 'UniThemeSettings'
})

type UniThemeLayout = 'default' | 'isa-light' | 'ems-dark' | 'mas-dark'

const visible = defineModel<boolean>({ required: true })
const appStore = useAppStore()
const { locale: globalLocale } = useI18n({
  useScope: 'global'
})

withDefaults(
  defineProps<{
    title?: string
  }>(),
  {
    title: '主题设置'
  }
)

const emit = defineEmits<{
  applied: [layout: UniThemeLayout]
}>()

const selectedLayout = ref<UniThemeLayout>('default')

const darkModeValue = computed({
  get: () => appStore.darkMode,
  set: (value: boolean) => appStore.setDarkMode(value)
})

const layoutValue = computed<UniThemeLayout>({
  get: () => selectedLayout.value,
  set: (value) => {
    selectedLayout.value = value
    appStore.setFrameworkLayout(value)
    emit('applied', value)
  }
})

const sidebarCollapsedValue = computed({
  get: () => appStore.sidebarCollapsed,
  set: (value: boolean) => appStore.setSidebarCollapsed(value)
})

const showTagsValue = computed({
  get: () => appStore.showTags,
  set: (value: boolean) => appStore.setShowTags(value)
})

const localeValue = computed({
  get: () => appStore.locale,
  set: (value: string) => {
    appStore.setLocale(value)
    globalLocale.value = value

    if (typeof document !== 'undefined') {
      document.documentElement.lang = value
    }
  }
})

watch(visible, (nextVisible) => {
  if (!nextVisible || typeof document === 'undefined') {
    return
  }

  const layout = document.documentElement.dataset.layout
  selectedLayout.value =
    layout === 'isa-light' || layout === 'ems-dark' || layout === 'mas-dark' ? layout : 'default'
})
</script>

<style lang="scss">
.uni-theme-settings {
  /** 避免 gutter 负 margin、输入框最小宽度导致抽屉内横向溢出 */
  .el-drawer__body {
    box-sizing: border-box;
    min-width: 0;
    overflow-x: hidden;
  }

  &__group {
    padding: 18px 0;
    border-bottom: 1px solid var(--el-border-color-light);
  }

  &__row {
    display: grid;
    grid-template-columns: 120px minmax(0, 1fr);
    gap: 24px;
    align-items: center;
    min-height: 46px;
    color: var(--el-text-color-primary);
    font-size: 15px;
  }

  &__select {
    width: 100%;
  }

  .el-segmented {
    justify-self: start;
  }
}
</style>
