<template>
  <UniUpload v-model:file-list="files" list-type="picture-card" accept="image/*" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { UploadUserFile } from 'element-plus'

const files = ref<UploadUserFile[]>([])
</script>
