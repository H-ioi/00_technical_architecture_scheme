<template>
  <div class="uni-list-page__header">
    <div>
      <h1>{{ $t('schoolBus.routeException.pageTitle') }}</h1>
      <p>{{ $t('schoolBus.routeException.pageDesc') }}</p>
    </div>
    <div class="uni-list-page__header-actions">
      <el-button v-uni-permission="'busexception_export'" @click="emit('export')">
        {{ $t('schoolBus.export') }}
      </el-button>
      <el-button v-uni-permission="'busexception_download'" @click="emit('download-template')">
        {{ $t('schoolBus.downloadTemplate') }}
      </el-button>
      <el-button v-uni-permission="'busexception_import'" @click="fileRef?.click()">
        {{ $t('schoolBus.import') }}
      </el-button>
      <el-button v-uni-permission="'busexception_add'" type="primary" @click="emit('add')">
        {{ $t('schoolBus.add') }}
      </el-button>
    </div>
  </div>

  <input
    ref="fileRef"
    type="file"
    accept=".xlsx,.xls"
    class="school-bus-route-exception__file"
    @change="emit('import-file', $event)" />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  export: []
  'download-template': []
  add: []
  'import-file': [event: Event]
}>()

const fileRef = ref<HTMLInputElement | null>(null)
</script>

<style scoped lang="scss">
.school-bus-route-exception__file {
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
  pointer-events: none;
}
</style>
