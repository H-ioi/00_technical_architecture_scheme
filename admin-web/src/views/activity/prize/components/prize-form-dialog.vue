<template>
  <el-dialog
    v-model="visible"
    :title="dialogTitle"
    width="760px"
    destroy-on-close
    append-to-body
    :close-on-click-modal="false"
    @closed="onClosed"
  >
    <UniForm ref="uniFormRef" v-model="form" :mode="uniMode" :config="formConfig">
      <template #field-imageUrl>
        <div class="activity-prize-form__image">
          <el-upload
            v-if="uniMode === 'edit'"
            accept="image/jpeg,image/png"
            :show-file-list="false"
            :before-upload="beforeUploadImage"
          >
            <el-button :loading="uploading" type="primary" plain>
              {{ $t('activity.pickCover') }}
            </el-button>
          </el-upload>
          <div v-if="form.imageUrl" class="activity-prize-form__preview">
            <img :src="form.imageUrl" alt="">
          </div>
        </div>
      </template>
    </UniForm>
    <template v-if="uniMode === 'edit'" #footer>
      <el-button @click="visible = false">{{ $t('common.cancel') }}</el-button>
      <el-button type="primary" :loading="saving" @click="submit">
        {{ $t('common.submit') }}
      </el-button>
    </template>
    <template v-else #footer>
      <el-button @click="visible = false">{{ $t('common.close') }}</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import type { UniFormConfig, UniOption } from 'uni-ui-lib'
import { UniForm, useUniI18n } from 'uni-ui-lib'
import { ElMessage } from 'element-plus'
import { computed, ref } from 'vue'

import { activityPrizeApi, activityProgramApi } from '@/api'
import type { ActivityPrizeFormModel, ActivityPrizeRow } from '@/types/modules/activity-prize'
import type { Translate } from '@/types/i18n'
import { normalizeArray, normalizeEnvelope } from '@/utils/api-response-normalize'

const emit = defineEmits<{ saved: [] }>()

const { t, locale } = useUniI18n()
const tr = t as Translate

const visible = ref(false)
const saving = ref(false)
const uploading = ref(false)
const mode = ref<'add' | 'edit' | 'view'>('add')
const uniFormRef = ref<InstanceType<typeof UniForm> | null>(null)
const programOptions = ref<UniOption[]>([])

const form = ref<ActivityPrizeFormModel>({
  cnName: '',
  enName: '',
  amount: undefined,
  prizeCount: 1,
  imageUrl: '',
  programId: undefined
})

const dialogTitle = computed(() =>
  mode.value === 'add'
    ? tr('activity.prizeAddTitle')
    : mode.value === 'edit'
      ? tr('activity.prizeEditTitle')
      : tr('activity.prizeDetailTitle')
)

const uniMode = computed(() => (mode.value === 'view' ? 'view' : 'edit'))

const formConfig = computed<UniFormConfig>(() => ({
  formProps: { labelPosition: 'top' },
  rowProps: { gutter: 16 },
  colProps: { span: 12 },
  rules: {
    cnName: [{ required: true, message: tr('activity.ruleInput'), trigger: 'blur' }],
    enName: [{ required: true, message: tr('activity.ruleInput'), trigger: 'blur' }],
    programId: [{ required: true, message: tr('activity.ruleSelect'), trigger: 'change' }],
    amount: [{ required: true, message: tr('activity.ruleInput'), trigger: 'blur' }],
    imageUrl: [{ required: true, message: tr('activity.ruleUpload'), trigger: 'change' }]
  } as UniFormConfig['rules'],
  schema: [
    {
      field: 'cnName',
      label: tr('activity.prizeCnName'),
      component: 'ElInput',
      componentProps: { maxlength: 100, showWordLimit: true }
    },
    {
      field: 'enName',
      label: tr('activity.prizeEnName'),
      component: 'ElInput',
      componentProps: { maxlength: 100, showWordLimit: true }
    },
    {
      field: 'programId',
      label: tr('activity.prizeProgram'),
      component: 'ElSelect',
      options: programOptions.value,
      viewType: 'enum',
      componentProps: {
        filterable: true,
        clearable: true,
        placeholder: tr('activity.ruleSelect'),
        style: { width: '100%' }
      }
    },
    {
      field: 'amount',
      label: tr('activity.prizeAmount'),
      component: 'ElInputNumber',
      componentProps: {
        min: 0,
        precision: 0,
        step: 1,
        controlsPosition: 'right',
        style: { width: '100%' }
      }
    },
    {
      field: 'imageUrl',
      label: tr('activity.prizeImage'),
      component: 'ElInput',
      colProps: { span: 24 }
    }
  ]
}))

function resetForm() {
  form.value = {
    cnName: '',
    enName: '',
    amount: undefined,
    prizeCount: 1,
    imageUrl: '',
    programId: undefined
  }
}

async function loadProgramOptions() {
  const raw = await activityProgramApi.listBrief.get({ programTypes: ['1'] })
  const rows = normalizeArray(raw) as ActivityPrizeRow[]
  programOptions.value = rows.map((row) => ({
    label: String(locale.value === 'en' ? (row.enName ?? row.cnName ?? '') : (row.cnName ?? row.enName ?? '')),
    value: row.id as string | number
  }))
}

async function fillFromDetail(id: string | number) {
  const raw = await activityPrizeApi.detail.get(id)
  const detail = normalizeEnvelope(raw)
  form.value = {
    id,
    cnName: String(detail.cnName ?? ''),
    enName: String(detail.enName ?? ''),
    amount: Number(detail.amount ?? 0),
    prizeCount: Number(detail.prizeCount ?? 1) || 1,
    imageUrl: String(detail.imageUrl ?? ''),
    programId: detail.programId as string | number | undefined
  }
}

async function beforeUploadImage(file: File) {
  if (!['image/jpeg', 'image/png'].includes(file.type)) {
    ElMessage.error(tr('activity.prizeImageTypeTip'))
    return false
  }
  if (file.size / 1024 / 1024 >= 20) {
    ElMessage.error(tr('activity.prizeImageSizeTip'))
    return false
  }

  uploading.value = true
  try {
    const url = await activityPrizeApi.uploadImage.post(file)
    if (!url) {
      ElMessage.error(tr('activity.uploadFail'))
      return false
    }
    form.value.imageUrl = url
    uniFormRef.value?.validateField('imageUrl')
  } finally {
    uploading.value = false
  }
  return false
}

async function submit() {
  try {
    await uniFormRef.value?.validate()
  } catch {
    return
  }

  const payload: Record<string, unknown> = {
    cnName: form.value.cnName,
    enName: form.value.enName,
    amount: form.value.amount,
    prizeCount: form.value.prizeCount || 1,
    imageUrl: form.value.imageUrl,
    programId: form.value.programId
  }

  saving.value = true
  try {
    if (mode.value === 'add') {
      await activityPrizeApi.add.post(payload)
    } else {
      payload.id = form.value.id
      await activityPrizeApi.edit.post(payload)
    }
    ElMessage.success(tr('activity.saveOk'))
    visible.value = false
    emit('saved')
  } finally {
    saving.value = false
  }
}

function onClosed() {
  resetForm()
  uniFormRef.value?.clearValidate()
}

defineExpose({
  open: async (m: 'add' | 'edit' | 'view', row?: ActivityPrizeRow) => {
    mode.value = m
    resetForm()
    await loadProgramOptions()
    if (m !== 'add' && row?.id != null) {
      await fillFromDetail(row.id as string | number)
    }
    visible.value = true
  }
})
</script>

<style scoped lang="scss">
.activity-prize-form {
  &__image {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__preview {
    width: 120px;
    height: 120px;
    border: 1px solid var(--el-border-color);
    border-radius: 8px;
    overflow: hidden;
    background: var(--el-fill-color-lighter);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
  }
}
</style>
