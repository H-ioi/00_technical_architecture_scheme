<template>
  <el-dialog v-model="visible" :title="title" width="640px" destroy-on-close>
    <div
      v-loading="detailLoading"
      class="content-announcement-form__body"
      :element-loading-text="$t('common.loading')"
    >
      <UniForm
        ref="uniFormRef"
        v-model="formModel"
        mode="edit"
        :config="dialogFormCfg"
      />
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

import { contentAnnouncementApi } from '@/api'
import type { ContentAnnouncementFormModel } from '@/types/modules/content-announcement'
import { normalizePayload } from '@/utils/api-response-normalize'

import {
  activeOpts,
  dialogFormConfig,
  dialogFormRules,
  emptyFormModel,
  urgencyLevelOpts
} from '../list.config'

import { useDialogDetailLoading } from '@/composables/use-dialog-detail-loading'

type Loose = Record<string, unknown>

const visible = defineModel<boolean>('visible', { required: true })

const props = defineProps<{
  mode: 'add' | 'edit'
  recordId: string | number | null
  schoolOptions: Array<{ label: string; value: string | number }>
}>()

const emit = defineEmits<{
  saved: []
}>()

const { t } = useUniI18n()
const { detailLoading, runWithDetailLoading } = useDialogDetailLoading()

const uniFormRef = ref<InstanceType<typeof UniForm> | null>(null)
const submitting = ref(false)
const formModel = ref<ContentAnnouncementFormModel>(emptyFormModel())

const dialogFormCfg = computed<UniFormConfig>(() => ({
  ...dialogFormConfig(t, props.schoolOptions, urgencyLevelOpts(t), activeOpts(t), false),
  rules: dialogFormRules(t)
}))

const title = computed(() =>
  t(props.mode === 'add' ? 'content.announcement.formAdd' : 'content.announcement.formEdit')
)

async function loadDetail(id: string | number) {
  const raw = await contentAnnouncementApi.detail.get(id)
  const row = normalizePayload(raw) as Loose
  formModel.value = {
    id: row.id as string | number,
    schoolId: row.schoolId as string | number | undefined,
    cnContent: String(row.cnContent || ''),
    enContent: String(row.enContent || ''),
    urgencyLevel: row.urgencyLevel as number | undefined,
    active: row.active ? '1' : '0'
  }
}

watch(
  () => visible.value,
  (open) => {
    if (!open) {
      formModel.value = emptyFormModel()
      return
    }

    void runWithDetailLoading(async () => {
      formModel.value = emptyFormModel()
      if (props.mode !== 'add' && props.recordId != null) {
        await loadDetail(props.recordId)
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
    const payload: ContentAnnouncementFormModel = {
      ...formModel.value,
      active: formModel.value.active === '1' || formModel.value.active === true
    }

    if (props.mode === 'add') {
      await contentAnnouncementApi.create.post(payload)
    } else {
      await contentAnnouncementApi.update.post(payload)
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
.content-announcement-form__body {
  min-height: 120px;
}
</style>
