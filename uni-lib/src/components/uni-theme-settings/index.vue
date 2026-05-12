<template>
  <el-drawer v-model="visible" class="uni-theme-settings" :title="title" size="520px">
    <el-form label-position="top" class="uni-theme-settings__form">
      <el-divider content-position="left">语义色与尺寸</el-divider>

      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="主题色">
            <el-color-picker v-model="form.primaryColor" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="页面背景">
            <el-color-picker v-model="form.pageBgColor" show-alpha />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="卡片 / 内容背景">
            <el-color-picker v-model="form.cardBgColor" show-alpha />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="边框色">
            <el-color-picker v-model="form.borderColor" show-alpha />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="主文字色">
            <el-color-picker v-model="form.textColor" show-alpha />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="次要文字色">
            <el-color-picker v-model="form.textColorSecondary" show-alpha />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="圆角基准">
            <el-input v-model="form.radiusBase" placeholder="如 8px" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="组件高度 · 大">
            <el-input v-model="form.componentSizeLarge" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="组件高度 · 默认">
            <el-input v-model="form.componentSize" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="组件高度 · 小">
            <el-input v-model="form.componentSizeSmall" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-divider content-position="left">自定义 CSS 变量</el-divider>
      <p class="uni-theme-settings__hint">
        可覆盖任意已注入到
        <code>:root</code>
        的变量（如
        <code>--uni-layout-menu-active-bg</code>
        、
        <code>--el-color-success</code>
        等），一行一键值；重复键以后者为准。
      </p>

      <div
        v-for="(row, index) in extraVariables"
        :key="index"
        class="uni-theme-settings__extra-row">
        <el-input v-model="row.key" placeholder="变量名，如 --uni-layout-bg" />
        <el-input v-model="row.value" placeholder="值" />
        <el-button :icon="Delete" circle @click="removeExtraVariable(index)" />
      </div>

      <el-button class="uni-theme-settings__add" :icon="Plus" @click="addExtraVariable"
        >添加变量</el-button
      >
    </el-form>

    <template #footer>
      <el-button @click="resetTheme">重置</el-button>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="applyTheme">应用</el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { Delete, Plus } from '@element-plus/icons-vue'
import { computed, reactive, ref, watch } from 'vue'

import { applyUniTheme, getStoredUniTheme, saveUniTheme } from './runtime'
import type { UniThemeOptions } from '@/types/uni-theme'

defineOptions({
  name: 'UniThemeSettings'
})

/** 由表单固定维护的 EP 尺寸变量，其余写入 `variables` 的条目归入「自定义 CSS 变量」编辑 */
const MANAGED_VARIABLE_KEYS = new Set([
  '--el-component-size-large',
  '--el-component-size',
  '--el-component-size-small'
])

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    defaultTheme?: UniThemeOptions
    storageKey?: string
    title?: string
  }>(),
  {
    defaultTheme: () => ({
      primaryColor: '#BA8E62',
      pageBgColor: '#f5f7fb',
      cardBgColor: '#ffffff',
      borderColor: '#e5e7eb',
      textColor: '#1f2937',
      textColorSecondary: '#6b7280',
      radiusBase: '8px'
    }),
    storageKey: 'uni-lib:theme',
    title: '主题设置'
  }
)

const emit = defineEmits<{
  'update:modelValue': [visible: boolean]
  applied: [theme: UniThemeOptions]
}>()

const form = reactive({
  primaryColor: '#BA8E62',
  pageBgColor: '#f5f7fb',
  cardBgColor: '#ffffff',
  borderColor: '#e5e7eb',
  textColor: '#1f2937',
  textColorSecondary: '#6b7280',
  radiusBase: '8px',
  componentSizeLarge: '40px',
  componentSize: '32px',
  componentSizeSmall: '24px'
})

const extraVariables = ref<Array<{ key: string; value: string }>>([])

const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const syncExtraFromVariables = (vars: Record<string, string> | undefined) => {
  if (!vars) {
    extraVariables.value = []
    return
  }
  extraVariables.value = Object.entries(vars)
    .filter(([k]) => !MANAGED_VARIABLE_KEYS.has(k))
    .map(([key, value]) => ({ key, value }))
}

const syncForm = (theme: UniThemeOptions) => {
  const d = props.defaultTheme

  form.primaryColor = theme.primaryColor ?? d.primaryColor ?? '#BA8E62'
  form.pageBgColor = theme.pageBgColor ?? d.pageBgColor ?? '#f5f7fb'
  form.cardBgColor = theme.cardBgColor ?? d.cardBgColor ?? '#ffffff'
  form.borderColor = theme.borderColor ?? d.borderColor ?? '#e5e7eb'
  form.textColor = theme.textColor ?? d.textColor ?? '#1f2937'
  form.textColorSecondary = theme.textColorSecondary ?? d.textColorSecondary ?? '#6b7280'
  form.radiusBase = theme.radiusBase ?? d.radiusBase ?? '8px'
  form.componentSizeLarge =
    theme.variables?.['--el-component-size-large'] ??
    d.variables?.['--el-component-size-large'] ??
    '40px'
  form.componentSize =
    theme.variables?.['--el-component-size'] ?? d.variables?.['--el-component-size'] ?? '32px'
  form.componentSizeSmall =
    theme.variables?.['--el-component-size-small'] ??
    d.variables?.['--el-component-size-small'] ??
    '24px'

  syncExtraFromVariables(theme.variables)
}

const buildExtrasObject = (): Record<string, string> => {
  const out: Record<string, string> = {}
  for (const row of extraVariables.value) {
    const k = row.key.trim()
    if (k) {
      out[k] = row.value
    }
  }
  return out
}

const buildTheme = (): UniThemeOptions => ({
  ...props.defaultTheme,
  primaryColor: form.primaryColor,
  pageBgColor: form.pageBgColor,
  cardBgColor: form.cardBgColor,
  borderColor: form.borderColor,
  textColor: form.textColor,
  textColorSecondary: form.textColorSecondary,
  radiusBase: form.radiusBase,
  variables: {
    ...props.defaultTheme.variables,
    '--el-component-size-large': form.componentSizeLarge,
    '--el-component-size': form.componentSize,
    '--el-component-size-small': form.componentSizeSmall,
    ...buildExtrasObject()
  }
})

const applyTheme = () => {
  const theme = buildTheme()

  applyUniTheme(theme)
  saveUniTheme(theme, props.storageKey)
  emit('applied', theme)
  visible.value = false
}

const resetTheme = () => {
  syncForm(props.defaultTheme)
  applyTheme()
}

const addExtraVariable = () => {
  extraVariables.value.push({ key: '', value: '' })
}

const removeExtraVariable = (index: number) => {
  extraVariables.value.splice(index, 1)
}

watch(
  () => props.modelValue,
  (nextVisible) => {
    if (nextVisible) {
      syncForm(getStoredUniTheme(props.storageKey) ?? props.defaultTheme)
    }
  }
)
</script>

<style scoped lang="scss">
.uni-theme-settings {
  /** 避免 gutter 负 margin、输入框最小宽度导致抽屉内横向溢出 */
  :deep(.el-drawer__body) {
    box-sizing: border-box;
    min-width: 0;
    overflow-x: hidden;
  }

  &__form {
    box-sizing: border-box;
    max-height: calc(100vh - 140px);
    min-width: 0;
    padding-right: 4px;
    overflow-x: hidden;
    overflow-y: auto;
  }

  :deep(.el-row) {
    margin-bottom: 0;
    max-width: 100%;
  }

  :deep(.el-col) {
    min-width: 0;
  }

  :deep(.el-col .el-form-item) {
    margin-bottom: 12px;
  }

  :deep(.el-form-item) {
    margin-bottom: 14px;
  }

  :deep(.el-form-item__content) {
    min-width: 0;
  }

  &__hint {
    margin: 0 0 12px;
    color: var(--el-text-color-secondary);
    font-size: 12px;
    line-height: 1.5;
    overflow-wrap: anywhere;
    word-break: break-word;

    code {
      padding: 0 4px;
      font-size: 11px;
      white-space: normal;
      word-break: break-all;
      background: var(--el-fill-color-light);
      border-radius: 4px;
    }
  }

  &__extra-row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) auto;
    gap: 8px;
    align-items: center;
    max-width: 100%;
    margin-bottom: 8px;

    :deep(.el-input) {
      width: 100%;
      min-width: 0;
    }

    :deep(.el-button) {
      flex-shrink: 0;
    }
  }

  &__add {
    margin-top: 4px;
    max-width: 100%;
  }
}
</style>
