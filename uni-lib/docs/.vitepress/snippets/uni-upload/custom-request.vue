<template>
  <UniUpload v-model:file-list="files" :request="mockUpload" list-type="text" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { UploadRequestOptions, UploadUserFile } from "element-plus";

const files = ref<UploadUserFile[]>([]);

async function mockUpload(options: UploadRequestOptions) {
  await new Promise((r) => setTimeout(r, 400));
  options.onSuccess?.({ ok: true } as never);
}
</script>
