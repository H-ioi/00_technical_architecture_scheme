<template>
  <el-alert
    class="school-bus-student-apply__cascade-alert"
    type="warning"
    :closable="false"
    show-icon
  >
    <template #default>
      <span>{{ $t('schoolBus.cascadeOptionsLoadFail') }}</span>
      <el-button type="primary" link @click="emit('retry')">
        {{ $t('common.retry') }}
      </el-button>
    </template>
  </el-alert>
</template>

<script setup lang="ts">
const emit = defineEmits<{ retry: [] }>()
</script>

<style scoped lang="scss">
.school-bus-student-apply__cascade-alert {
  margin-bottom: 12px;
}
</style>
