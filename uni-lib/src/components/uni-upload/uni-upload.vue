<script setup lang="ts">
import type {
  UploadFile,
  UploadFiles,
  UploadProps,
  UploadRequestOptions,
  UploadUserFile,
} from "element-plus";

const props = withDefaults(
  defineProps<{
    fileList?: UploadUserFile[];
    action?: string;
    request?: (options: UploadRequestOptions) => Promise<unknown> | void;
    accept?: string;
    limit?: number;
    maxSize?: number;
    multiple?: boolean;
    headers?: Record<string, string>;
    data?: Record<string, unknown>;
    disabled?: boolean;
    listType?: "text" | "picture" | "picture-card";
  }>(),
  {
    fileList: () => [],
    action: "",
    listType: "text",
  },
);

const emit = defineEmits<{
  "update:fileList": [fileList: UploadUserFile[]];
  success: [response: unknown, file: UploadFile, files: UploadFiles];
  error: [error: Error, file: UploadFile, files: UploadFiles];
  remove: [file: UploadFile, files: UploadFiles];
  preview: [file: UploadFile];
  exceed: [files: File[], uploadFiles: UploadUserFile[]];
  "validate-error": [message: string, file: File];
  progress: [event: ProgressEvent, file: UploadFile, files: UploadFiles];
}>();

const beforeUpload: UploadProps["beforeUpload"] = (file) => {
  if (props.maxSize && file.size > props.maxSize) {
    emit("validate-error", `文件大小不能超过 ${props.maxSize} bytes`, file);
    return false;
  }

  return true;
};

const handleUpdateFileList = (files: UploadUserFile[]) =>
  emit("update:fileList", files);
const handleSuccess: UploadProps["onSuccess"] = (response, file, files) =>
  emit("success", response, file, files);
const handleError: UploadProps["onError"] = (error, file, files) =>
  emit("error", error, file, files);
const handleRemove: UploadProps["onRemove"] = (file, files) =>
  emit("remove", file, files);
const handlePreview: UploadProps["onPreview"] = (file) => emit("preview", file);
const handleExceed: UploadProps["onExceed"] = (files, uploadFiles) =>
  emit("exceed", files, uploadFiles);
const handleProgress: UploadProps["onProgress"] = (event, file, files) =>
  emit("progress", event as ProgressEvent, file, files);
</script>

<template>
  <el-upload
    :file-list="fileList"
    :action="action"
    :http-request="request"
    :accept="accept"
    :limit="limit"
    :multiple="multiple"
    :headers="headers"
    :data="data"
    :disabled="disabled"
    :list-type="listType"
    :before-upload="beforeUpload"
    @update:file-list="handleUpdateFileList"
    @success="handleSuccess"
    @error="handleError"
    @remove="handleRemove"
    @preview="handlePreview"
    @exceed="handleExceed"
    @progress="handleProgress"
  >
    <slot name="trigger">
      <el-button type="primary">上传文件</el-button>
    </slot>
    <template v-if="$slots.tip" #tip>
      <slot name="tip" />
    </template>
    <template v-if="$slots.file" #file="scope">
      <slot name="file" v-bind="scope" />
    </template>
  </el-upload>
</template>
