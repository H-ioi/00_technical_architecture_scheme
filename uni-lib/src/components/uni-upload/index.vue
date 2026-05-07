<script setup lang="ts">
/**
 * 上传封装：基于 Element Plus `ElUpload`，暴露常用 props / 事件，
 * 并用 `v-model:fileList` 双向绑定列表；可选 `maxSize` 在校验失败时触发 `validate-error`。
 * 默认触发区：`list-type="picture-card"` 为加号图标，其余为「上传文件」按钮；可用 `#trigger` 覆盖。
 */
import { Plus } from "@element-plus/icons-vue";
import { ElIcon } from "element-plus";
import type {
  UploadFile,
  UploadFiles,
  UploadProps,
  UploadRequestOptions,
  UploadUserFile,
} from "element-plus";
import { useUniI18n } from "@/services/i18n";

const i18n = useUniI18n();

const props = withDefaults(
  defineProps<{
    fileList?: UploadUserFile[];
    action?: string;
    request?: (options: UploadRequestOptions) => Promise<unknown> | void;
    accept?: string;
    limit?: number;
    maxSize?: number;
    maxTotalSize?: number;
    multiple?: boolean;
    name?: string;
    autoUpload?: boolean;
    drag?: boolean;
    showFileList?: boolean;
    withCredentials?: boolean;
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
  change: [file: UploadFile, files: UploadFiles];
}>();

const fileListSize = () =>
  props.fileList.reduce((total, file) => total + (file.size ?? 0), 0);

const isAcceptedFile = (file: File) => {
  if (!props.accept) {
    return true;
  }

  const acceptRules = props.accept.split(",").map((item) => item.trim());

  return acceptRules.some((rule) => {
    if (rule === "") {
      return true;
    }

    if (rule.startsWith(".")) {
      return file.name.toLowerCase().endsWith(rule.toLowerCase());
    }

    if (rule.endsWith("/*")) {
      return file.type.startsWith(rule.slice(0, -1));
    }

    return file.type === rule;
  });
};

const beforeUpload: UploadProps["beforeUpload"] = (file) => {
  if (!isAcceptedFile(file)) {
    emit(
      "validate-error",
      i18n.t("upload.accept", { accept: props.accept }),
      file,
    );
    return false;
  }

  if (props.maxSize && file.size > props.maxSize) {
    emit(
      "validate-error",
      i18n.t("upload.maxSize", { size: props.maxSize }),
      file,
    );
    return false;
  }

  if (props.maxTotalSize && fileListSize() + file.size > props.maxTotalSize) {
    emit(
      "validate-error",
      i18n.t("upload.maxTotalSize", { size: props.maxTotalSize }),
      file,
    );
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
const handleChange: UploadProps["onChange"] = (file, files) =>
  emit("change", file, files);
</script>

<template>
  <el-upload
    :file-list="fileList"
    :action="action"
    :http-request="request"
    :accept="accept"
    :limit="limit"
    :multiple="multiple"
    :name="name"
    :auto-upload="autoUpload"
    :drag="drag"
    :show-file-list="showFileList"
    :with-credentials="withCredentials"
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
    @change="handleChange"
  >
    <slot name="trigger">
      <ElIcon
        v-if="listType === 'picture-card'"
        class="uni-upload__trigger-plus"
      >
        <Plus />
      </ElIcon>
      <el-button v-else type="primary">{{
        i18n.t("upload.trigger")
      }}</el-button>
    </slot>
    <template v-if="$slots.tip" #tip>
      <slot name="tip" />
    </template>
    <template v-if="$slots.file" #file="scope">
      <slot name="file" v-bind="scope" />
    </template>
  </el-upload>
</template>
