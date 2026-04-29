# UniUpload

上传组件基于 Element Plus `ElUpload`，通过 `action` 或 `request` 注入上传实现，不内置固定接口。

```vue
<UniUpload
  v-model:file-list="files"
  :request="uploadFile"
  :max-size="10485760"
/>
```
