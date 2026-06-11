<template>
  <el-dialog
    v-model="visible"
    :title="title"
    width="min(1000px, 96vw)"
    destroy-on-close
    class="content-article-form-dialog">
    <div
      v-loading="detailLoading"
      class="content-article-form-dialog__body"
      :element-loading-text="$t('common.loading')">
      <UniForm ref="uniFormRef" v-model="formModel" mode="edit" :config="dialogFormCfg">
        <template #field-mainImage>
          <el-upload
            class="content-article-form-dialog__upload"
            :show-file-list="false"
            accept="image/jpeg,image/png"
            :before-upload="onBeforeUpload">
            <img
              v-if="formModel.mainImage"
              :src="formModel.mainImage"
              class="content-article-form-dialog__preview"
              alt="" />
            <el-icon v-else class="content-article-form-dialog__upload-icon"><Plus /></el-icon>
          </el-upload>
        </template>
        <template #field-content>
          <UniEditor v-model="editorHtml" height="320px" />
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

import { contentArticleApi } from '@/api'
import UniEditor from '@/components/uni-editor/index.vue'
import type { ContentArticleFormModel } from '@/types/modules/content-article'
import { normalizePayload } from '@/utils/api-response-normalize'

import {
  boolFilterOpts,
  dialogFormConfig,
  dialogFormRules,
  emptyFormModel,
  importanceLevelOpts,
  wechatOptionOpts
} from '../list.config'

import { useDialogDetailLoading } from '@/composables/use-dialog-detail-loading'

type Loose = Record<string, unknown>

const visible = defineModel<boolean>('visible', { required: true })

const props = defineProps<{
  mode: 'add' | 'edit'
  recordId: string | number | null
  schoolOptions: Array<{ label: string; value: string | number }>
  categoryOptions: Array<{ label: string; value: string | number }>
}>()

const emit = defineEmits<{
  saved: []
}>()

const { t } = useUniI18n()
const { detailLoading, runWithDetailLoading } = useDialogDetailLoading()

const uniFormRef = ref<InstanceType<typeof UniForm> | null>(null)
const submitting = ref(false)
const formModel = ref<ContentArticleFormModel>(emptyFormModel())
const editorHtml = ref('')

const dialogFormCfg = computed<UniFormConfig>(() => ({
  ...dialogFormConfig(
    t,
    props.schoolOptions,
    props.categoryOptions,
    importanceLevelOpts(t),
    boolFilterOpts(t),
    wechatOptionOpts(t)
  ),
  rules: dialogFormRules(t)
}))

const title = computed(() =>
  t(props.mode === 'add' ? 'content.article.formAdd' : 'content.article.formEdit')
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

  formModel.value.mainImage = await contentArticleApi.uploadMainImage.post(file)
  return false
}

watch(
  () => visible.value,
  (open) => {
    if (!open) {
      formModel.value = emptyFormModel()
      editorHtml.value = ''
      return
    }

    void runWithDetailLoading(async () => {
      formModel.value = emptyFormModel()
      editorHtml.value = ''
      if (props.mode === 'edit' && props.recordId != null) {
        const raw = await contentArticleApi.detail.get(props.recordId)
        const row = normalizePayload(raw) as Loose
        formModel.value = {
          id: row.id as string | number,
          cnTitle: String(row.cnTitle || ''),
          enTitle: String(row.enTitle || ''),
          schoolId: row.schoolId as string | number | undefined,
          categoryId: row.categoryId as string | number | undefined,
          mainImage: String(row.mainImage || ''),
          importanceLevel: Number(row.importanceLevel ?? 1),
          visible: Boolean(row.visible),
          isBanner: Boolean(row.isBanner),
          recommended: Boolean(row.recommended),
          wechatOption: row.wechatOption as number | string | undefined,
          wechatUrl: String(row.wechatUrl || ''),
          content: String(row.content || '')
        }
        editorHtml.value = String(row.content || '')
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
    const html = editorHtml.value
    const payload: ContentArticleFormModel = {
      ...formModel.value,
      content: html,
      enContent: html
    }

    if (props.mode === 'add') {
      await contentArticleApi.create.post(payload)
    } else {
      await contentArticleApi.update.post(payload)
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
.content-article-form-dialog {
  &__body {
    min-height: 200px;
    max-height: min(70vh, 640px);
    overflow: auto;
  }

  &__upload {
    :deep(.el-upload) {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      width: 120px;
      height: 120px;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
  }

  &__preview {
    width: 120px;
    height: 120px;
    object-fit: cover;
  }

  &__upload-icon {
    font-size: 28px;
    color: var(--el-text-color-secondary);
  }
}
</style>
