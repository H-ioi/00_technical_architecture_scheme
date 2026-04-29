<template>
  <UniUpload
    v-model:file-list="files"
    list-type="picture"
    accept="image/*"
    :request="mockUpload"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { UploadRequestOptions, UploadUserFile } from "element-plus";

const files = ref<UploadUserFile[]>([
  {
    name: "示例图片",
    status: "success",
    uid: 1,
    url: "https://element-plus.org/images/element-plus-logo.svg",
  },
]);

async function mockUpload(options: UploadRequestOptions) {
  await new Promise((resolve) => setTimeout(resolve, 300));
  options.onSuccess?.({ ok: true } as never);
}
</script>
