<template>
  <UniUpload
    v-model:file-list="files"
    list-type="text"
    :limit="2"
    multiple
    :request="mock"
    @exceed="onExceed"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ElMessage } from "element-plus";
import type { UploadRequestOptions, UploadUserFile } from "element-plus";

const files = ref<UploadUserFile[]>([]);

async function mock(options: UploadRequestOptions) {
  options.onSuccess?.({} as never);
}

function onExceed() {
  ElMessage.warning("最多 2 个文件，可在 @exceed 中提示");
}
</script>
