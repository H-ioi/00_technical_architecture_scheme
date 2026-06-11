<template>
  <el-dialog
    v-model="visible"
    :title="title"
    width="min(1100px, 96vw)"
    destroy-on-close
    class="content-navigate-button-form-dialog">
    <div
      v-loading="detailLoading"
      class="content-navigate-button-form-dialog__body"
      :element-loading-text="$t('common.loading')">
      <UniForm ref="uniFormRef" v-model="formModel" mode="edit" :config="dialogFormCfg">
        <template #field-icon>
          <el-upload
            class="content-navigate-button-form-dialog__upload"
            :show-file-list="false"
            accept="image/jpeg,image/png"
            :before-upload="onBeforeUpload">
            <img
              v-if="formModel.icon"
              :src="formModel.icon"
              class="content-navigate-button-form-dialog__preview"
              alt="" />
            <el-icon v-else class="content-navigate-button-form-dialog__upload-icon"
              ><Plus
            /></el-icon>
          </el-upload>
        </template>
        <template #field-chosenArticleId>
          <el-transfer
            v-model="formModel.chosenArticleId"
            class="content-navigate-button-form-dialog__transfer"
            filterable
            :titles="[
              $t('content.navigateButton.transferSource'),
              $t('content.navigateButton.transferTarget')
            ]"
            :data="articleOptions" />
        </template>
      </UniForm>
    </div>

    <template #footer>
      <el-button @click="visible = false">{{ $t('content.cancel') }}</el-button>
      <el-button type="primary" :loading="submitting" @click="submit">
        {{ $t('content.submit') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { UploadRawFile } from 'element-plus'
import { UniForm, useUniI18n } from 'uni-ui-lib'
import type { UniFormConfig } from 'uni-ui-lib'
import { computed, ref, watch } from 'vue'

import { contentNavigateButtonApi } from '@/api'
import type {
  ContentArticleVisibleRecord,
  ContentNavigateButtonFormModel
} from '@/types/modules/content-navigate-button'
import { normalizeArray, normalizePayload } from '@/utils/api-response-normalize'

import { activeRadioOpts, dialogFormConfig, dialogFormRules, emptyFormModel } from '../list.config'

import { useDialogDetailLoading } from '@/composables/use-dialog-detail-loading'

type Loose = Record<string, unknown>
type TransferOption = { key: string | number; label: string }

const visible = defineModel<boolean>('visible', { required: true })

const props = defineProps<{
  mode: 'add' | 'edit'
  recordId: string | number | null
}>()

const emit = defineEmits<{
  saved: []
}>()

const { locale, t } = useUniI18n()
const { detailLoading, runWithDetailLoading } = useDialogDetailLoading()

const uniFormRef = ref<InstanceType<typeof UniForm> | null>(null)
const submitting = ref(false)
const formModel = ref<ContentNavigateButtonFormModel>(emptyFormModel())
const articleOptions = ref<TransferOption[]>([])

const dialogFormCfg = computed<UniFormConfig>(() => ({
  ...dialogFormConfig(t, activeRadioOpts(t)),
  rules: dialogFormRules(t)
}))

const title = computed(() =>
  t(props.mode === 'add' ? 'content.navigateButton.formAdd' : 'content.navigateButton.formEdit')
)

function toTransferOptions(records: ContentArticleVisibleRecord[]): TransferOption[] {
  const useEn = locale() === 'en'
  return records.map((item) => ({
    key: item.id,
    label: useEn
      ? String(item.enTitle || item.cnTitle || item.id)
      : String(item.cnTitle || item.enTitle || item.id)
  }))
}

async function loadArticleOptions() {
  const raw = await contentNavigateButtonApi.articleVisibleList.get()
  articleOptions.value = toTransferOptions(normalizeArray(raw) as ContentArticleVisibleRecord[])
}

function parseChosenArticleIds(value: unknown): Array<string | number> {
  if (Array.isArray(value)) {
    return value
  }
  if (typeof value === 'string' && value.trim()) {
    return value.split(',').map((item) => item.trim())
  }
  return []
}

async function loadDetail(id: string | number) {
  const raw = await contentNavigateButtonApi.detail.get(id)
  const row = normalizePayload(raw) as Loose
  formModel.value = {
    id: row.id as string | number,
    cnName: String(row.cnName || ''),
    enName: String(row.enName || ''),
    icon: String(row.icon || ''),
    index: Number(row.index ?? 0),
    active: row.active ? '1' : '0',
    chosenArticleId: parseChosenArticleIds(row.chosenArticleId)
  }
}

watch(
  () => visible.value,
  (open) => {
    if (!open) {
      formModel.value = emptyFormModel()
      articleOptions.value = []
      return
    }

    void runWithDetailLoading(async () => {
      formModel.value = emptyFormModel()
      await loadArticleOptions()
      if (props.mode === 'edit' && props.recordId != null) {
        await loadDetail(props.recordId)
      }
    })
  }
)

const onBeforeUpload = async (file: UploadRawFile) => {
  const okType = file.type === 'image/jpeg' || file.type === 'image/png'
  const okSize = file.size / 1024 / 1024 < 20
  if (!okType) {
    ElMessage.error(t('content.article.uploadTypeError'))
    return false
  }
  if (!okSize) {
    ElMessage.error(t('content.article.uploadSizeError'))
    return false
  }

  formModel.value.icon = await contentNavigateButtonApi.uploadIcon.post(file)
  return false
}

const submit = async () => {
  const valid = await uniFormRef.value?.validate().catch(() => false)
  if (!valid) {
    return
  }

  submitting.value = true
  try {
    const chosen = formModel.value.chosenArticleId ?? []
    const payload: ContentNavigateButtonFormModel = {
      ...formModel.value,
      active: formModel.value.active === '1' || formModel.value.active === true,
      chosenArticleId: chosen.length > 0 ? chosen.join(',') : ''
    }

    if (props.mode === 'add') {
      await contentNavigateButtonApi.create.post(payload)
    } else {
      await contentNavigateButtonApi.update.post(payload)
    }

    ElMessage.success(t('content.saveSuccess'))
    visible.value = false
    emit('saved')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped lang="scss">
.content-navigate-button-form-dialog__body {
  min-height: 120px;
}

.content-navigate-button-form-dialog__upload {
  :deep(.el-upload) {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    overflow: hidden;
    width: 120px;
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.content-navigate-button-form-dialog__preview {
  width: 120px;
  height: 120px;
  object-fit: contain;
}

.content-navigate-button-form-dialog__upload-icon {
  font-size: 28px;
  color: var(--el-text-color-secondary);
}

.content-navigate-button-form-dialog__transfer {
  width: 100%;

  :deep(.el-transfer-panel) {
    width: calc(50% - 82px);
  }
}
</style>
