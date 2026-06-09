<template>
  <el-dialog v-model="visible" :title="title" width="640px" destroy-on-close>
    <div
      v-loading="detailLoading"
      class="content-discussion-comment-form__body"
      :element-loading-text="$t('common.loading')">
      <UniForm ref="uniFormRef" v-model="formModel" mode="edit" :config="dialogFormCfg" />
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
import { ElMessage } from 'element-plus'
import { UniForm, useUniI18n } from 'uni-ui-lib'
import type { UniFormConfig } from 'uni-ui-lib'
import { computed, ref, watch } from 'vue'

import { contentDiscussionCommentApi } from '@/api'
import type { ContentDiscussionCommentFormModel } from '@/types/modules/content-discussion-comment'
import { normalizePayload } from '@/utils/api-response-normalize'

import {
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
  discussionOptions: Array<{ label: string; value: string | number }>
}>()

const emit = defineEmits<{
  saved: []
}>()

const { t } = useUniI18n()
const { detailLoading, runWithDetailLoading } = useDialogDetailLoading()

const uniFormRef = ref<InstanceType<typeof UniForm> | null>(null)
const submitting = ref(false)
const formModel = ref<ContentDiscussionCommentFormModel>(emptyFormModel())

const dialogFormCfg = computed<UniFormConfig>(() => ({
  ...dialogFormConfig(t, props.discussionOptions, visibleRadioOpts(t)),
  rules: dialogFormRules(t)
}))

const title = computed(() =>
  t(props.mode === 'add' ? 'content.discussionComment.formAdd' : 'content.discussionComment.formEdit')
)

watch(
  () => visible.value,
  (open) => {
    if (!open) {
      formModel.value = emptyFormModel()
      return
    }

    void runWithDetailLoading(async () => {
      formModel.value = emptyFormModel()
      if (props.mode === 'edit' && props.recordId != null) {
        const raw = await contentDiscussionCommentApi.detail.get(props.recordId)
        const row = normalizePayload(raw) as Loose
        formModel.value = {
          id: row.id as string | number,
          discussionId: row.discussionId as string | number | undefined,
          parentId: row.parentId as string | number | undefined,
          content: String(row.content || ''),
          visible: Boolean(row.visible)
        }
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
    if (props.mode === 'add') {
      await contentDiscussionCommentApi.create.post(formModel.value)
    } else {
      await contentDiscussionCommentApi.update.post(formModel.value)
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
.content-discussion-comment-form__body {
  min-height: 80px;
}
</style>
