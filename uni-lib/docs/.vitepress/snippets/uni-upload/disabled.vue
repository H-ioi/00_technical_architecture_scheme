<template>
  <UniUpload v-model:file-list="files" list-type="text" disabled />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { UploadUserFile } from 'element-plus'

const files = ref<UploadUserFile[]>([{ name: '示例.txt', status: 'success' as const, uid: 1 }])
</script>
