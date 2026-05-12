<template>
  <div class="icon-picker">
    <el-input
      :model-value="modelValue || ''"
      readonly
      clearable
      class="icon-picker__input"
      :placeholder="placeholder"
      @clear="onClear">
      <template #prefix>
        <el-icon v-if="currentComp" class="icon-picker__prefix-ico">
          <component :is="currentComp" />
        </el-icon>
      </template>
      <template #suffix>
        <el-button type="primary" link class="icon-picker__open" @click="pickerOpen = true">
          ···
        </el-button>
      </template>
    </el-input>

    <el-dialog
      v-model="pickerOpen"
      :title="t('common.iconPicker')"
      width="560px"
      append-to-body
      destroy-on-close
      class="icon-picker__dialog"
      @closed="filterKeyword = ''">
      <el-input
        v-model="filterKeyword"
        clearable
        class="icon-picker__search"
        :placeholder="t('common.iconSearch')" />
      <div class="icon-picker__grid-wrap">
        <div class="icon-picker__grid">
          <button
            v-for="name in filteredNames"
            :key="name"
            type="button"
            class="icon-picker__cell"
            :class="{ 'is-active': name === modelValue }"
            :title="name"
            @click="pick(name)">
            <el-icon class="icon-picker__cell-ico">
              <component :is="iconMap[name]" />
            </el-icon>
          </button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'
import { computed, ref } from 'vue'
import { useUniI18n } from 'uni-ui-lib'

import { sidebarIconMap, sidebarIconNames } from './registry'

const props = defineProps<{
  modelValue?: string
  placeholder?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: string): void
}>()

const { t } = useUniI18n()

const iconMap = sidebarIconMap
const allNames = sidebarIconNames

const pickerOpen = ref(false)
const filterKeyword = ref('')

const filteredNames = computed(() => {
  const q = filterKeyword.value.trim().toLowerCase()
  if (!q) {
    return allNames
  }
  return allNames.filter((n) => n.toLowerCase().includes(q))
})

const currentComp = computed<Component | undefined>(() => {
  const v = props.modelValue
  if (!v) {
    return undefined
  }
  return iconMap[v]
})

const pick = (name: string) => {
  emit('update:modelValue', name)
  pickerOpen.value = false
}

const onClear = () => {
  emit('update:modelValue', '')
}
</script>

<style scoped lang="scss">
.icon-picker__input {
  width: 100%;
}
.icon-picker__prefix-ico {
  font-size: 18px;
}
.icon-picker__open {
  padding: 0 4px;
  font-weight: 700;
  letter-spacing: 1px;
}
.icon-picker__search {
  margin-bottom: 12px;
}
.icon-picker__grid-wrap {
  max-height: 360px;
  overflow-y: auto;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 6px;
  padding: 8px;
}
.icon-picker__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(48px, 1fr));
  gap: 8px;
}
.icon-picker__cell {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  margin: 0;
  padding: 0;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 6px;
  background: var(--el-fill-color-blank);
  cursor: pointer;
  transition:
    border-color 0.15s,
    background 0.15s;
  &:hover {
    border-color: var(--el-color-primary-light-5);
    background: var(--el-fill-color-light);
  }
  &.is-active {
    border-color: var(--el-color-primary);
    background: var(--el-color-primary-light-9);
  }
}
.icon-picker__cell-ico {
  font-size: 22px;
}
</style>
