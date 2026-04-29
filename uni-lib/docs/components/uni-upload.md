<script setup lang="ts">
import { ElMessage } from "element-plus";
import { ref } from "vue";

import type { UploadRequestOptions, UploadUserFile } from "element-plus";

import codeCard from "../.vitepress/snippets/uni-upload/picture-card.vue?raw";
import codeCustomReq from "../.vitepress/snippets/uni-upload/custom-request.vue?raw";
import codeDisabled from "../.vitepress/snippets/uni-upload/disabled.vue?raw";
import codeLimit from "../.vitepress/snippets/uni-upload/limit-multiple.vue?raw";
import codeMaxSize from "../.vitepress/snippets/uni-upload/max-size.vue?raw";
import codeText from "../.vitepress/snippets/uni-upload/text.vue?raw";
import codeTipTrigger from "../.vitepress/snippets/uni-upload/tip-trigger.vue?raw";

const files = ref<UploadUserFile[]>([]);
const filesCard = ref<UploadUserFile[]>([]);
const filesReq = ref<UploadUserFile[]>([]);
const filesDisabled = ref<UploadUserFile[]>([
  { name: "示例.txt", status: "success", uid: 1 },
]);
const filesLimit = ref<UploadUserFile[]>([]);
const filesMax = ref<UploadUserFile[]>([]);

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
| `headers` / `data` | 请求头 / 额外表单字段           | `Record`                                | —      |
| `disabled`         | 禁用                            | `boolean`                               | —      |
| `listType`         | 列表样式                        | `'text' \| 'picture' \| 'picture-card'` | `text` |

## Events

与 Element Plus `ElUpload` 一致：`success`、`error`、`remove`、`preview`、`exceed`、`validate-error`、`progress`，以及 `update:fileList`。

## Slots

| 插槽      | 说明                           |
| --------- | ------------------------------ |
| `trigger` | 触发区域，默认「上传文件」按钮 |
| `tip`     | 提示说明                       |
| `file`    | 自定义文件列表项               |
