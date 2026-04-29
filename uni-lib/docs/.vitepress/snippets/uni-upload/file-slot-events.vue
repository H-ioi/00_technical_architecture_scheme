<template>
  <UniUpload
    v-model:file-list="files"
    list-type="text"
    :request="mockUpload"
    @success="onSuccess"
    @remove="onRemove"
    @preview="onPreview"
  >
    <template #file="{ file }">
      <div class="custom-file-item">
        <span>{{ file.name }}</span>
        <el-tag size="small" :type="file.status === 'success' ? 'success' : 'info'">
          {{ file.status || "ready" }}
        </el-tag>
      </div>
    </template>
  </UniUpload>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type {
  UploadFile,
  UploadFiles,
  UploadRequestOptions,
  UploadUserFile,
} from "element-plus";

const files = ref<UploadUserFile[]>([
  { name: "已上传文件.pdf", status: "success", uid: 1 },
]);

async function mockUpload(options: UploadRequestOptions) {
  await new Promise((resolve) => setTimeout(resolve, 300));
  options.onSuccess?.({ url: "/mock-file.pdf" } as never);
}

function onSuccess(response: unknown, file: UploadFile) {
  console.info("success", response, file.name);
}

function onRemove(file: UploadFile, uploadFiles: UploadFiles) {
  console.info("remove", file.name, uploadFiles.length);
}

function onPreview(file: UploadFile) {
  console.info("preview", file.name);
}
</script>

<style scoped>
.custom-file-item {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}
</style>
