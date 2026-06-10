<template>
  <el-dialog
    v-model="visible"
    :title="title"
    width="min(1000px, 96vw)"
    destroy-on-close
    class="content-discussion-form-dialog"
  >
    <div
      v-loading="detailLoading"
      class="content-discussion-form-dialog__body"
      :element-loading-text="$t('common.loading')"
    >
      <UniForm ref="uniFormRef" v-model="formModel" mode="edit" :config="dialogFormCfg">
        <template #field-images>
          <div class="content-discussion-form-dialog__image-grid">
            <div
              v-for="item in imageSlots"
              :key="item.field"
              class="content-discussion-form-dialog__image-item"
            >
              <span class="content-discussion-form-dialog__image-label">{{ item.label }}</span>
              <el-upload
                class="content-discussion-form-dialog__uploader"
                :show-file-list="false"
                accept="image/jpeg,image/png"
                :before-upload="(file) => onBeforeImage(file, item.field)"
              >
                <img
                  v-if="formModel[item.field]"
                  :src="String(formModel[item.field])"
                  class="content-discussion-form-dialog__preview"
                >
                <el-icon v-else class="content-discussion-form-dialog__plus"><Plus /></el-icon>
              </el-upload>
            </div>
          </div>
        </template>
        <template #field-pdfs>
          <el-upload
            multiple
            :limit="10"
            :file-list="pdfFiles"
            accept="application/pdf"
            :before-upload="onBeforePdfUpload"
            :on-remove="onPdfRemove"
            :on-preview="onPreview"
          >
            <el-button type="primary">{{ $t('content.discussion.upload') }}</el-button>
            <template #tip>
              <div class="el-upload__tip">{{ $t('content.discussion.uploadPdfTip') }}</div>
            </template>
          </el-upload>
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
import type { UploadRawFile, UploadUserFile } from 'element-plus'
import { ElMessage } from 'element-plus'
import { UniForm, useUniI18n } from 'uni-ui-lib'
import type { UniFormConfig } from 'uni-ui-lib'
import { computed, ref, watch } from 'vue'

import { contentDiscussionApi } from '@/api'
import type { ContentDiscussionFormModel, DiscussionPdfItem } from '@/types/modules/content-discussion'
import { normalizePayload } from '@/utils/api-response-normalize'

import {
  boolRadioOpts,
  dialogFormConfig,
  dialogFormRules,
  emptyFormModel,
  scopeOpts
} from '../list.config'

import { useDialogDetailLoading } from '@/composables/use-dialog-detail-loading'

type Loose = Record<string, unknown>
type ImageField = keyof Pick<
  ContentDiscussionFormModel,
  | 'mainImg'
  | 'secondImg'
  | 'thirdImg'
  | 'fourthImage'
  | 'fifthImage'
  | 'sixthImage'
  | 'seventhImage'
  | 'eighthImage'
  | 'ninthImage'
>

const visible = defineModel<boolean>('visible', { required: true })

const props = defineProps<{
  mode: 'add' | 'edit'
  recordId: string | number | null
  schoolOptions: Array<{ label: string; value: string | number }>
  tagOptions: Array<{ label: string; value: string | number }>
}>()

const emit = defineEmits<{
  saved: []
}>()

const { t } = useUniI18n()
const { detailLoading, runWithDetailLoading } = useDialogDetailLoading()

const uniFormRef = ref<InstanceType<typeof UniForm> | null>(null)
const submitting = ref(false)
const formModel = ref<ContentDiscussionFormModel>(emptyFormModel())
const pdfFiles = ref<UploadUserFile[]>([])

const imageSlots = computed(() => [
  { field: 'mainImg' as ImageField, label: t('content.discussion.imageMain') },
  { field: 'secondImg' as ImageField, label: t('content.discussion.image2') },
  { field: 'thirdImg' as ImageField, label: t('content.discussion.image3') },
  { field: 'fourthImage' as ImageField, label: t('content.discussion.image4') },
  { field: 'fifthImage' as ImageField, label: t('content.discussion.image5') },
  { field: 'sixthImage' as ImageField, label: t('content.discussion.image6') },
  { field: 'seventhImage' as ImageField, label: t('content.discussion.image7') },
  { field: 'eighthImage' as ImageField, label: t('content.discussion.image8') },
  { field: 'ninthImage' as ImageField, label: t('content.discussion.image9') }
])

const dialogFormCfg = computed<UniFormConfig>(() => ({
  ...dialogFormConfig(
    t,
    props.schoolOptions,
    props.tagOptions,
    scopeOpts(t),
    boolRadioOpts(t)
  ),
  rules: dialogFormRules(t)
}))

const title = computed(() =>
  t(props.mode === 'add' ? 'content.discussion.formAdd' : 'content.discussion.formEdit')
)

function mapPdfList(items: DiscussionPdfItem[] | undefined): UploadUserFile[] {
  if (!items?.length) {
    return []
  }
  return items.map((item, index) => {
    const url = String(item.pdf || item.url || '')
    return { name: String(item.name || url || `pdf-${index}`), url, status: 'success' as const }
  })
}

function buildPdfList(files: UploadUserFile[]): DiscussionPdfItem[] {
  return files
    .filter((file) => file.url)
    .map((file) => ({
      name: file.name,
      url: file.url,
      pdf: file.url
    }))
}

const onBeforeImage = async (file: UploadRawFile, field: ImageField) => {
  const okType = file.type === 'image/jpeg' || file.type === 'image/png'
  const okSize = file.size / 1024 / 1024 < 20
  if (!okType) {
    ElMessage.error(t('content.discussion.uploadTypeError'))
    return false
  }
  if (!okSize) {
    ElMessage.error(t('content.discussion.uploadSizeError'))
    return false
  }

  const url = await contentDiscussionApi.uploadFile.post(file)
  formModel.value = { ...formModel.value, [field]: url }
  return false
}

const onBeforePdfUpload = async (file: UploadRawFile) => {
  const okType = file.type === 'application/pdf'
  const okSize = file.size / 1024 / 1024 < 20
  if (!okType) {
    ElMessage.error(t('content.discussion.uploadPdfTypeError'))
    return false
  }
  if (!okSize) {
    ElMessage.error(t('content.discussion.uploadSizeError'))
    return false
  }

  const url = await contentDiscussionApi.uploadFile.post(file)
  pdfFiles.value = [...pdfFiles.value, { name: file.name, url, status: 'success' }]
  return false
}

const onPdfRemove = (_file: UploadUserFile, fileList: UploadUserFile[]) => {
  pdfFiles.value = fileList
}

const onPreview = (file: UploadUserFile) => {
  if (file.url) {
    window.open(file.url, '_blank')
  }
}

watch(
  () => visible.value,
  (open) => {
    if (!open) {
      formModel.value = emptyFormModel()
      pdfFiles.value = []
      return
    }

    void runWithDetailLoading(async () => {
      formModel.value = emptyFormModel()
      pdfFiles.value = []
      if (props.mode === 'edit' && props.recordId != null) {
        const raw = await contentDiscussionApi.detail.get(props.recordId)
        const row = normalizePayload(raw) as Loose
        const tags = (row.tagList as Array<{ id?: string | number }> | undefined) || []
        formModel.value = {
          id: row.id as string | number,
          schoolId: row.schoolId as string | number | undefined,
          tagId: tags[0]?.id ?? (row.tagId as string | number | undefined),
          scope: Number(row.scope ?? 1),
          active: Boolean(row.active),
          recommended: Boolean(row.recommended),
          top: Boolean(row.top),
          cnContent: String(row.cnContent || ''),
          enContent: String(row.enContent || ''),
          mainImg: String(row.mainImg || ''),
          secondImg: String(row.secondImg || ''),
          thirdImg: String(row.thirdImg || ''),
          fourthImage: String(row.fourthImage || ''),
          fifthImage: String(row.fifthImage || ''),
          sixthImage: String(row.sixthImage || ''),
          seventhImage: String(row.seventhImage || ''),
          eighthImage: String(row.eighthImage || ''),
          ninthImage: String(row.ninthImage || '')
        }
        pdfFiles.value = mapPdfList(row.pdfList as DiscussionPdfItem[] | undefined)
      }
    })
  }
)

const submit = async () => {
  const valid = await uniFormRef.value?.validate().catch(() => false)
  if (!valid) {
    return
  }
  if (!formModel.value.mainImg) {
    ElMessage.error(t('content.discussion.ruleMainImage'))
    return
  }

  submitting.value = true
  try {
    const payload: ContentDiscussionFormModel = {
      ...formModel.value,
      pdfList: buildPdfList(pdfFiles.value)
    }

    if (props.mode === 'add') {
      await contentDiscussionApi.create.post(payload)
    } else {
      await contentDiscussionApi.update.post(payload)
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
.content-discussion-form-dialog__body {
  min-height: 200px;
  max-height: min(75vh, 680px);
  overflow: auto;
}

.content-discussion-form-dialog__image-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.content-discussion-form-dialog__image-item {
  width: 120px;
}

.content-discussion-form-dialog__image-label {
  display: block;
  margin-bottom: 8px;
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.content-discussion-form-dialog__uploader {
  :deep(.el-upload) {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 120px;
    height: 120px;
    overflow: hidden;
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
  }
}

.content-discussion-form-dialog__preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.content-discussion-form-dialog__plus {
  font-size: 28px;
  color: var(--el-text-color-secondary);
}
</style>
