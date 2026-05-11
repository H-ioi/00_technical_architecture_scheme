<template>
  <el-select
    :model-value="modelValue || ''"
    class="menu-icon-picker"
    clearable
    filterable
    :placeholder="placeholder"
    style="width: 100%"
    @update:model-value="onUpdate"
  >
    <el-option v-for="name in iconNames" :key="name" :label="name" :value="name">
      <span class="menu-icon-picker__option">
        <el-icon class="menu-icon-picker__ico">
          <component :is="iconMap[name]" />
        </el-icon>
        <span>{{ name }}</span>
      </span>
    </el-option>
  </el-select>
</template>

<script setup lang="ts">
import { uniLayoutDefaultMenuIconMap, uniLayoutDefaultMenuIconNames } from 'uni-ui-lib'

defineProps<{
  modelValue?: string
  placeholder?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: string): void
}>()

const iconNames = uniLayoutDefaultMenuIconNames
const iconMap = uniLayoutDefaultMenuIconMap

const onUpdate = (v: string | null | undefined) => {
  emit('update:modelValue', v ?? '')
}
</script>

<style scoped lang="scss">
.menu-icon-picker__option {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.menu-icon-picker__ico {
  font-size: 18px;
}
</style>
