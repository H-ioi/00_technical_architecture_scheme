<script setup lang="ts">
import { ref } from "vue";

import type { UploadUserFile } from "element-plus";

const files = ref<UploadUserFile[]>([]);
</script>

# UniUpload

上传组件基于 Element Plus `ElUpload`，通过 `action` 或 `request` 注入上传实现，不内置固定接口。

## 示例（仅 UI，未接真实上传）

<ClientOnly>
  <div class="vp-raw uni-lib-demo">
    <UniUpload v-model:file-list="files" list-type="text" />
  </div>
</ClientOnly>

接入业务时使用 `action` 或自定义 `request`：

```vue
<UniUpload
  v-model:file-list="files"
  :request="uploadFile"
  :max-size="10485760"
/>
```
