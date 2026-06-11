<template>
  <el-drawer v-model="visible" class="uni-theme-settings" :title="title" size="520px">
    <el-form label-position="top" class="uni-theme-settings__form">
      <el-divider content-position="left">布局主题</el-divider>
      <p class="uni-theme-settings__hint">
        主题变量统一维护在 <code>uni-lib/src/styles/variables.scss</code>，这里仅切换根节点
        <code>data-layout</code> 属性。
      </p>

      <el-radio-group v-model="selectedLayout" class="uni-theme-settings__layouts">
        <el-radio-button label="default">默认主题</el-radio-button>
        <el-radio-button label="isa-light">ISA 浅色</el-radio-button>
        <el-radio-button label="custom">自定义主题</el-radio-button>
      </el-radio-group>
    </el-form>

    <template #footer>
      <el-button @click="resetTheme">重置</el-button>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="applyTheme">应用</el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

defineOptions({
  name: 'UniThemeSettings'
})

type UniThemeLayout = 'default' | 'isa-light' | 'custom'

const visible = defineModel<boolean>({ required: true })

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

const applyTheme = () => {
  if (typeof document !== 'undefined') {
    document.documentElement.dataset.layout = selectedLayout.value
  }

  emit('applied', selectedLayout.value)
  visible.value = false
}

const resetTheme = () => {
  selectedLayout.value = 'default'
  applyTheme()
}

watch(visible, (nextVisible) => {
  if (!nextVisible || typeof document === 'undefined') {
    return
  }

  const layout = document.documentElement.dataset.layout
  selectedLayout.value = layout === 'isa-light' || layout === 'custom' ? layout : 'default'
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

  &__form {
    box-sizing: border-box;
    max-height: calc(100vh - 140px);
    min-width: 0;
    padding-right: 4px;
    overflow-x: hidden;
    overflow-y: auto;
  }

  .el-form-item {
    margin-bottom: 14px;
  }

  .el-form-item__content {
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

  &__layouts {
    max-width: 100%;
  }
}
</style>
