<script setup lang="ts">
import { ElMessage } from "element-plus";
import { ref } from "vue";

import type { UploadRequestOptions, UploadUserFile } from "element-plus";

import codeCard from "../.vitepress/snippets/uni-upload/picture-card.vue?raw";
import codeCustomReq from "../.vitepress/snippets/uni-upload/custom-request.vue?raw";
import codeDisabled from "../.vitepress/snippets/uni-upload/disabled.vue?raw";
import codeFileSlotEvents from "../.vitepress/snippets/uni-upload/file-slot-events.vue?raw";
import codeLimit from "../.vitepress/snippets/uni-upload/limit-multiple.vue?raw";
import codeMaxSize from "../.vitepress/snippets/uni-upload/max-size.vue?raw";
import codePictureList from "../.vitepress/snippets/uni-upload/picture-list.vue?raw";
import codeText from "../.vitepress/snippets/uni-upload/text.vue?raw";
import codeTipTrigger from "../.vitepress/snippets/uni-upload/tip-trigger.vue?raw";

const files = ref<UploadUserFile[]>([]);
const filesCard = ref<UploadUserFile[]>([]);
const filesPicture = ref<UploadUserFile[]>([
  {
    name: "示例图片",
    status: "success",
    uid: 1,
    url: "https://element-plus.org/images/element-plus-logo.svg",
  },
]);
const filesReq = ref<UploadUserFile[]>([]);
const filesDisabled = ref<UploadUserFile[]>([
  { name: "示例.txt", status: "success", uid: 1 },
]);
const filesLimit = ref<UploadUserFile[]>([]);
const filesMax = ref<UploadUserFile[]>([]);
const filesCustom = ref<UploadUserFile[]>([
  { name: "已上传文件.pdf", status: "success", uid: 1 },
]);

async function mockUpload(options: UploadRequestOptions) {
  await new Promise((r) => setTimeout(r, 400));
  options.onSuccess?.({ ok: true } as never);
}

async function mockLimit(options: UploadRequestOptions) {
  options.onSuccess?.({} as never);
}

function onExceed() {
  ElMessage.warning("最多 2 个文件");
}

function onValidateError(message: string) {
  ElMessage.warning(message);
}

function onSuccess() {
  ElMessage.success("上传成功");
}

function onRemove() {
  ElMessage.info("已移除文件");
}

function onPreview(file: UploadUserFile) {
  ElMessage.info(`预览：${file.name}`);
}
</script>

# UniUpload

上传组件基于 Element Plus `ElUpload`，通过 `action` 或 `request` 注入上传实现，不内置固定接口。

---

## 文本列表

<CompDemo title="list-type=text" :code="codeText">
  <UniUpload v-model:file-list="files" list-type="text" />
</CompDemo>

## 照片墙

<CompDemo title="list-type=picture-card" :code="codeCard">
  <UniUpload
    v-model:file-list="filesCard"
    list-type="picture-card"
    accept="image/*"
  />
</CompDemo>

## 图片列表

`list-type="picture"` 适合头像、附件缩略图等列表式展示；已有文件可通过 `fileList` 的 `url` 字段回显。

<CompDemo title="list-type=picture + 初始文件" :code="codePictureList">
  <UniUpload
    v-model:file-list="filesPicture"
    list-type="picture"
    accept="image/*"
    :request="mockUpload"
  />
</CompDemo>

## 自定义 request

<CompDemo title="最小 :request 骨架" :code="codeCustomReq">
  <UniUpload
    v-model:file-list="filesReq"
    list-type="text"
    :request="mockUpload"
  />
</CompDemo>

## 插槽 trigger / tip

<CompDemo title="自定义按钮与说明" :code="codeTipTrigger">
  <UniUpload v-model:file-list="files" list-type="text" accept=".pdf,.doc">
    <template #trigger>
      <el-button type="success" plain>选择文件</el-button>
    </template>
    <template #tip>
      <div class="el-upload__tip">仅示例；生产环境请配置 :action 或 :request</div>
    </template>
  </UniUpload>
</CompDemo>

## 自定义文件项与事件

使用 `#file` 可以完全替换文件列表项；常用事件会透传 Element Plus 的文件对象，适合做预览、删除确认、上传成功后写回业务字段。

<CompDemo title="#file + success / remove / preview" :code="codeFileSlotEvents">
  <UniUpload
    v-model:file-list="filesCustom"
    list-type="text"
    :request="mockUpload"
    @success="onSuccess"
    @remove="onRemove"
    @preview="onPreview"
  >
    <template #file="{ file }">
      <div style="display: flex; gap: 8px; align-items: center; justify-content: space-between; width: 100%">
        <span>{{ file.name }}</span>
        <el-tag size="small" :type="file.status === 'success' ? 'success' : 'info'">
          {{ file.status || "ready" }}
        </el-tag>
      </div>
    </template>
  </UniUpload>
</CompDemo>

## 禁用

<CompDemo title="disabled" :code="codeDisabled">
  <UniUpload v-model:file-list="filesDisabled" list-type="text" disabled />
</CompDemo>

## 多选 + 数量限制 + exceed

<CompDemo title="limit + multiple + @exceed" :code="codeLimit">
  <UniUpload
    v-model:file-list="filesLimit"
    list-type="text"
    :limit="2"
    multiple
    :request="mockLimit"
    @exceed="onExceed"
  />
</CompDemo>

## 文件大小限制

<CompDemo title="maxSize + @validate-error" :code="codeMaxSize">
  <UniUpload
    v-model:file-list="filesMax"
    list-type="text"
    :max-size="600"
    :request="mockLimit"
    @validate-error="onValidateError"
  />
</CompDemo>

::: tip
`maxSize` 与 `request` 的完整示例见「文件大小限制」展开代码；实际项目请把 `request` 换为真实上传。
:::

## Props

| 属性               | 说明                            | 类型                                    | 默认值 |
| ------------------ | ------------------------------- | --------------------------------------- | ------ |
| `fileList`         | 文件列表（`v-model:file-list`） | `UploadUserFile[]`                      | `[]`   |
| `action`           | 上传地址（与 `request` 二选一） | `string`                                | `''`   |
| `request`          | 自定义上传方法                  | `UploadRequestOptions => Promise`       | —      |
| `accept`           | 可选文件类型                    | `string`                                | —      |
| `limit`            | 最大文件数                      | `number`                                | —      |
| `maxSize`          | 单文件最大字节                  | `number`                                | —      |
| `multiple`         | 是否多选                        | `boolean`                               | —      |
| `name`             | 上传文件字段名                  | `string`                                | —      |
| `autoUpload`       | 选中文件后是否自动上传          | `boolean`                               | —      |
| `drag`             | 是否启用拖拽上传                | `boolean`                               | —      |
| `showFileList`     | 是否展示文件列表                | `boolean`                               | —      |
| `withCredentials`  | 上传请求是否携带 cookie         | `boolean`                               | —      |
| `headers` / `data` | 请求头 / 额外表单字段           | `Record`                                | —      |
| `disabled`         | 禁用                            | `boolean`                               | —      |
| `listType`         | 列表样式                        | `'text' \| 'picture' \| 'picture-card'` | `text` |

## Events

与 Element Plus `ElUpload` 一致：`success`、`error`、`remove`、`preview`、`exceed`、`validate-error`、`progress`、`change`，以及 `update:fileList`。

## Slots

| 插槽      | 说明                           |
| --------- | ------------------------------ |
| `trigger` | 触发区域，默认「上传文件」按钮 |
| `tip`     | 提示说明                       |
| `file`    | 自定义文件列表项               |
