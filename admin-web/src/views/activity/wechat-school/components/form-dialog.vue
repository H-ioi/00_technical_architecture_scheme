<template>
  <el-dialog
    v-model="visible"
    :title="dialogTitle"
    width="720px"
    destroy-on-close
    append-to-body
    :close-on-click-modal="false"
    @closed="onClosed"
  >
    <UniForm ref="uniFormRef" v-model="form" :mode="uniMode" :config="formConfig" />
    <template v-if="mode !== 'view'" #footer>
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
import { UniForm, toUniOptions, useUniI18n } from 'uni-ui-lib'
import { ElMessage } from 'element-plus'
import { computed, ref } from 'vue'

import { membershipApi, wechatSchoolInfoApi } from '@/api'
import type {
  WechatSchoolInfoFormModel,
  WechatSchoolInfoRow
} from '@/types/modules/wechat-school-info'
import type { Translate } from '@/types/i18n'
import { normalizeEnvelope } from '@/utils/api-response-normalize'

import { activeOptions } from '../list.config'

const emit = defineEmits<{ saved: [] }>()

const { t, locale } = useUniI18n()
const tr = t as Translate

const visible = ref(false)
const saving = ref(false)
const mode = ref<'add' | 'edit' | 'view'>('add')
const uniFormRef = ref<InstanceType<typeof UniForm> | null>(null)
const schoolOptions = ref<UniOption[]>([])

const form = ref<WechatSchoolInfoFormModel>({
  id: undefined,
  schoolId: undefined,
  wechatAppid: '',
  wechatSecret: '',
  msgTemplateId: '',
  verifyToken: '',
  active: '1'
})

const dialogTitle = computed(() => {
  if (mode.value === 'add') {
    return tr('activity.wechatSchoolAddTitle')
  }
  if (mode.value === 'view') {
    return tr('activity.wechatSchoolDetailTitle')
  }
  return tr('activity.wechatSchoolEditTitle')
})

const uniMode = computed(() => (mode.value === 'view' ? 'view' : 'edit'))

const formConfig = computed<UniFormConfig>(() => ({
  formProps: { labelPosition: 'top' },
  rowProps: { gutter: 16 },
  colProps: { span: 24 },
  rules: {
    schoolId: [{ required: true, message: tr('activity.ruleSelect'), trigger: 'change' }],
    wechatAppid: [{ required: true, message: tr('activity.ruleInput'), trigger: 'blur' }],
    wechatSecret: [{ required: true, message: tr('activity.ruleInput'), trigger: 'blur' }],
    active: [{ required: true, message: tr('activity.ruleSelect'), trigger: 'change' }]
  } as UniFormConfig['rules'],
  schema: [
    {
      field: 'schoolId',
      label: tr('activity.colSchool'),
      component: 'ElSelect',
      options: schoolOptions.value,
      viewType: 'enum',
      componentProps: {
        filterable: true,
        clearable: true,
        placeholder: tr('activity.ruleSelect'),
        style: { width: '100%' }
      }
    },
    {
      field: 'wechatAppid',
      label: tr('activity.wechatAppid'),
      component: 'ElInput',
      componentProps: { maxlength: 200, showWordLimit: true }
    },
    {
      field: 'wechatSecret',
      label: tr('activity.wechatSecret'),
      component: 'ElInput',
      componentProps: { type: 'password', showPassword: true, maxlength: 500, showWordLimit: true }
    },
    {
      field: 'msgTemplateId',
      label: tr('activity.wechatTemplateId'),
      component: 'ElInput',
      componentProps: { maxlength: 200, showWordLimit: true }
    },
    {
      field: 'verifyToken',
      label: tr('activity.wechatVerifyToken'),
      component: 'ElInput',
      componentProps: { maxlength: 500, showWordLimit: true }
    },
    {
      field: 'active',
      label: tr('activity.activeStatus'),
      component: 'ElRadioGroup',
      viewType: 'enum',
      options: activeOptions(tr)
    }
  ]
}))

function resetForm() {
  form.value = {
    id: undefined,
    schoolId: undefined,
    wechatAppid: '',
    wechatSecret: '',
    msgTemplateId: '',
    verifyToken: '',
    active: '1'
  }
}

async function loadSchoolOptions() {
  const raw = await membershipApi.school.get()
  const list = Array.isArray(raw) ? raw : []
  schoolOptions.value = toUniOptions(list as Record<string, unknown>[], {
    labelKeys: locale.value === 'en' ? ['enName', 'name', 'cnName'] : ['cnName', 'name', 'enName'],
    valueKey: 'id'
  })
}

async function fillFromDetail(id: string | number) {
  const raw = await wechatSchoolInfoApi.detail.get(id)
  const d = normalizeEnvelope(raw) as WechatSchoolInfoRow
  const schoolHit =
    d.schoolId == null || d.schoolId === ''
      ? undefined
      : schoolOptions.value.find((item) => String(item.value) === String(d.schoolId))?.value
  form.value = {
    id,
    schoolId: schoolHit as string | number | undefined,
    wechatAppid: String(d.wechatAppid ?? ''),
    wechatSecret: String(d.wechatSecret ?? ''),
    msgTemplateId: String(d.msgTemplateId ?? ''),
    verifyToken: String(d.verifyToken ?? ''),
    active: String(d.active ?? '1')
  }
}

async function submit() {
  try {
    await uniFormRef.value?.validate()
  } catch {
    return
  }

  const payload: Record<string, unknown> = {
    schoolId: form.value.schoolId,
    wechatAppid: form.value.wechatAppid,
    wechatSecret: form.value.wechatSecret,
    msgTemplateId: form.value.msgTemplateId,
    verifyToken: form.value.verifyToken,
    active: Number(form.value.active)
  }

  saving.value = true
  try {
    if (mode.value === 'add') {
      await wechatSchoolInfoApi.add.post(payload)
    } else {
      payload.id = form.value.id
      await wechatSchoolInfoApi.edit.post(payload)
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
  open: async (m: 'add' | 'edit' | 'view', row?: WechatSchoolInfoRow) => {
    mode.value = m
    resetForm()
    await loadSchoolOptions()
    if (m !== 'add' && row?.id != null) {
      await fillFromDetail(row.id as string | number)
    }
    visible.value = true
  }
})
</script>
