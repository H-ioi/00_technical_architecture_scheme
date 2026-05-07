<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import type { UploadFile, UploadUserFile } from 'element-plus'

import { useAppI18n } from '@/composables/use-app-i18n'

const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  'update:visible': [visible: boolean]
  submit: [data: FormData]
  downloadTemplate: []
}>()

const { t } = useAppI18n()
const fileList = ref<UploadUserFile[]>([])
const selectedFile = ref<File | null>(null)

watch(
  () => props.visible,
  (visible) => {
    if (!visible) {
      fileList.value = []
      selectedFile.value = null
    }
  }
)

const close = () => {
  emit('update:visible', false)
}

const handleChange = (file: UploadFile) => {
  selectedFile.value = file.raw ?? null
}

const submit = () => {
  if (!selectedFile.value) {
    ElMessage.warning(t('member.messages.uploadRequired'))
    return
  }

  const data = new FormData()

  data.append('file', selectedFile.value)
  emit('submit', data)
}
</script>

<template>
  <el-dialog
    :model-value="visible"
    :title="t('member.sections.importInfo')"
    width="640px"
    destroy-on-close
    :close-on-click-modal="false"
    @update:model-value="emit('update:visible', $event)"
  >
    <div class="member-import">
      <UniUpload
        v-model:file-list="fileList"
        drag
        accept=".xls,.xlsx"
        :limit="1"
        :max-size="10 * 1024 * 1024"
        :auto-upload="false"
        @change="handleChange"
        @validate-error="(message) => ElMessage.warning(message)"
      >
        <template #trigger>
          <div class="member-import__trigger">
            <strong>{{ t('member.actions.selectFile') }}</strong>
            <span>{{ t('member.messages.uploadTip') }}</span>
          </div>
        </template>
      </UniUpload>

      <el-button text type="primary" @click="emit('downloadTemplate')">
        {{ t('member.actions.downloadTemplate') }}
      </el-button>
    </div>

    <template #footer>
      <el-button @click="close">{{ t('member.actions.cancel') }}</el-button>
      <el-button type="primary" @click="submit">{{ t('member.actions.submit') }}</el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.member-import {
  display: grid;
  gap: 12px;
}

.member-import__trigger {
  display: grid;
  gap: 8px;
  justify-items: center;
  padding: 24px;

  span {
    color: var(--app-text-color-secondary);
    font-size: 13px;
  }
}
</style>
