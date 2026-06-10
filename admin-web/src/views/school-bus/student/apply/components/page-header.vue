<template>
  <div class="uni-list-page__header">
    <div>
      <h1>{{ $t('schoolBus.studentApply.pageTitle') }}</h1>
      <p>{{ $t('schoolBus.studentApply.pageDesc') }}</p>
    </div>
    <div class="uni-list-page__header-actions">
      <el-button
        v-uni-permission="'busorder_import_intention_order'"
        @click="emit('download-template')"
      >
        {{ $t('schoolBus.downloadTemplate') }}
      </el-button>
      <el-button v-uni-permission="'busorder_import_intention_order'" @click="fileRef?.click()">
        {{ $t('schoolBus.import') }}
      </el-button>
      <el-button v-uni-permission="'busorder_add'" type="primary" @click="emit('add')">
        {{ $t('schoolBus.add') }}
      </el-button>
    </div>
  </div>

  <input
    ref="fileRef"
    type="file"
    accept=".xlsx,.xls"
    class="school-bus-student-apply__file"
    @change="emit('import-file', $event)"
  >
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  'download-template': []
  add: []
  'import-file': [event: Event]
}>()

const fileRef = ref<HTMLInputElement | null>(null)
</script>

<style scoped lang="scss">
.school-bus-student-apply {
  &__file {
    position: absolute;
    width: 0;
    height: 0;
    opacity: 0;
    pointer-events: none;
  }
}
</style>
