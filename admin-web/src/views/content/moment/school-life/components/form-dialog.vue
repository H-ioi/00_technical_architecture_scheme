<template>
  <el-dialog
    v-model="visible"
    :title="title"
    width="min(1000px, 96vw)"
    destroy-on-close
    class="content-school-life-form-dialog"
  >
    <div
      v-loading="detailLoading"
      class="content-school-life-form-dialog__body"
      :element-loading-text="$t('common.loading')"
    >
      <UniForm ref="uniFormRef" v-model="formModel" mode="edit" :config="dialogFormCfg">
        <template #field-images>
          <el-upload
            multiple
            :limit="10"
            :file-list="imageFiles"
            accept="image/jpeg,image/png"
            :before-upload="onBeforeImageUpload"
            :on-remove="onImageRemove"
            :on-preview="onPreview"
          >
            <el-button type="primary">{{ $t('content.schoolLife.upload') }}</el-button>
            <template #tip>
              <div class="el-upload__tip">{{ $t('content.schoolLife.uploadImageTip') }}</div>
            </template>
          </el-upload>
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
            <el-button type="primary">{{ $t('content.schoolLife.upload') }}</el-button>
            <template #tip>
              <div class="el-upload__tip">{{ $t('content.schoolLife.uploadPdfTip') }}</div>
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
import type { UploadRawFile, UploadUserFile } from 'element-plus'
import { ElMessage } from 'element-plus'
import { UniForm, useUniI18n } from 'uni-ui-lib'
import type { UniFormConfig } from 'uni-ui-lib'
import { computed, ref, watch } from 'vue'

import { contentMomentApi } from '@/api'
import type { ContentMomentFormModel, MomentAttachment } from '@/types/modules/content-moment'
import { normalizePayload } from '@/utils/api-response-normalize'

import {
  boolFilterOpts,
  dialogFormConfig,
  dialogFormRules,
  emptyFormModel,
  visibleRadioOpts
} from '../list.config'

import { useDialogDetailLoading } from '@/composables/use-dialog-detail-loading'

type Loose = Record<string, unknown>

const visible = defineModel<boolean>('visible', { required: true })

const props = defineProps<{
  mode: 'add' | 'edit'
  recordId: string | number | null
  schoolOptions: Array<{ label: string; value: string | number }>
  typeOptions: Array<{ label: string; value: string | number }>
}>()

const emit = defineEmits<{
  saved: []
}>()

const { t } = useUniI18n()
const { detailLoading, runWithDetailLoading } = useDialogDetailLoading()

const uniFormRef = ref<InstanceType<typeof UniForm> | null>(null)
const submitting = ref(false)
const formModel = ref<ContentMomentFormModel>(emptyFormModel())
const imageFiles = ref<UploadUserFile[]>([])
const pdfFiles = ref<UploadUserFile[]>([])

const dialogFormCfg = computed<UniFormConfig>(() => ({
  ...dialogFormConfig(
    t,
    props.schoolOptions,
    props.typeOptions,
    visibleRadioOpts(t),
    boolFilterOpts(t)
  ),
  rules: dialogFormRules(t)
}))

const title = computed(() =>
  t(props.mode === 'add' ? 'content.schoolLife.formAdd' : 'content.schoolLife.formEdit')
)

function mapAttachmentsToFiles(
  items: MomentAttachment[] | undefined,
  key: 'image' | 'pdf'
): UploadUserFile[] {
  if (!items?.length) {
    return []
  }
  return items.map((item, index) => {
    const name = String(item[key] || item.url || `file-${index}`)
    return { name, url: String(item.url || ''), status: 'success' as const }
  })
}

function buildAttachments(files: UploadUserFile[], key: 'image' | 'pdf'): MomentAttachment[] {
  return files
    .filter((file) => file.url)
    .map((file) => {
      if (key === 'image') {
        return { image: file.name, url: file.url }
      }
      return { pdf: file.name, url: file.url }
    })
}

const onBeforeImageUpload = async (file: UploadRawFile) => {
  const okType = file.type === 'image/jpeg' || file.type === 'image/png'
  const okSize = file.size / 1024 / 1024 < 20
  if (!okType) {
    ElMessage.error(t('content.schoolLife.uploadTypeError'))
    return false
  }
  if (!okSize) {
    ElMessage.error(t('content.schoolLife.uploadSizeError'))
    return false
  }

  const url = await contentMomentApi.uploadFile.post(file)
  imageFiles.value = [...imageFiles.value, { name: file.name, url, status: 'success' }]
  return false
}

const onBeforePdfUpload = async (file: UploadRawFile) => {
  const okType = file.type === 'application/pdf'
  const okSize = file.size / 1024 / 1024 < 20
  if (!okType) {
    ElMessage.error(t('content.schoolLife.uploadPdfTypeError'))
    return false
  }
  if (!okSize) {
    ElMessage.error(t('content.schoolLife.uploadSizeError'))
    return false
  }

  const url = await contentMomentApi.uploadFile.post(file)
  pdfFiles.value = [...pdfFiles.value, { name: file.name, url, status: 'success' }]
  return false
}

const onImageRemove = (_file: UploadUserFile, fileList: UploadUserFile[]) => {
  imageFiles.value = fileList
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
      imageFiles.value = []
      pdfFiles.value = []
      return
    }

    void runWithDetailLoading(async () => {
      formModel.value = emptyFormModel()
      imageFiles.value = []
      pdfFiles.value = []
      if (props.mode === 'edit' && props.recordId != null) {
        const raw = await contentMomentApi.detail.get(props.recordId)
        const row = normalizePayload(raw) as Loose
        formModel.value = {
          id: row.id as string | number,
          schoolId: row.schoolId as string | number | undefined,
          type: row.type as string | number | undefined,
          title: String(row.title || ''),
          content: String(row.content || ''),
          push: Boolean(row.push),
          sendSms: Boolean(row.sendSms),
          visible: row.visible === true || row.visible === '1' || row.visible === 1 ? '1' : '0'
        }
        imageFiles.value = mapAttachmentsToFiles(row.images as MomentAttachment[] | undefined, 'image')
        pdfFiles.value = mapAttachmentsToFiles(row.pdfs as MomentAttachment[] | undefined, 'pdf')
      }
    })
  }
)

const submit = async () => {
  const valid = await uniFormRef.value?.validate().catch(() => false)
  if (!valid) {
    return
  }

  submitting.value = true
  try {
    const payload: ContentMomentFormModel = {
      ...formModel.value,
      images: buildAttachments(imageFiles.value, 'image'),
      pdfs: buildAttachments(pdfFiles.value, 'pdf')
    }

    if (props.mode === 'add') {
      await contentMomentApi.create.post(payload)
    } else {
      await contentMomentApi.update.post(payload)
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
.content-school-life-form-dialog__body {
  min-height: 200px;
  max-height: min(75vh, 680px);
  overflow: auto;
}
</style>
