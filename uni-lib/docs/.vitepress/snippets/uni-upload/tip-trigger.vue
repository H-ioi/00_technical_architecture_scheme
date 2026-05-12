<template>
  <UniUpload v-model:file-list="files" list-type="text" accept=".pdf,.doc">
    <template #trigger>
      <el-button type="success" plain>选择文件</el-button>
    </template>
    <template #tip>
      <div class="el-upload__tip">仅示例；实际项目请配置 :action 或 :request</div>
    </template>
  </UniUpload>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { UploadUserFile } from 'element-plus'

const files = ref<UploadUserFile[]>([])
</script>
