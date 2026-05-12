<template>
  <UniUpload
    v-model:file-list="files"
    list-type="text"
    :max-size="600"
    :request="mock"
    @validate-error="onValidateError" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { UploadRequestOptions, UploadUserFile } from 'element-plus'

const files = ref<UploadUserFile[]>([])

async function mock(options: UploadRequestOptions) {
  options.onSuccess?.({} as never)
}

function onValidateError(message: string) {
  ElMessage.warning(message)
}
</script>
