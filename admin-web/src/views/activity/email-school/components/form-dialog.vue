<template>
  <el-dialog
    v-model="visible"
    :title="dialogTitle"
    width="640px"
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

import { membershipApi, schoolEmailConfigApi } from '@/api'
import type {
  SchoolEmailConfigFormModel,
  SchoolEmailConfigRow
} from '@/types/modules/school-email-config'
import type { Translate } from '@/types/i18n'
import { normalizeArray, normalizeEnvelope } from '@/utils/api-response-normalize'

const emit = defineEmits<{ saved: [] }>()

const { t, locale } = useUniI18n()
const tr = t as Translate

const visible = ref(false)
const saving = ref(false)
const mode = ref<'add' | 'edit' | 'view'>('add')
const uniFormRef = ref<InstanceType<typeof UniForm> | null>(null)
const schoolOptions = ref<UniOption[]>([])
const appModuleOptions = ref<UniOption[]>([])

const form = ref<SchoolEmailConfigFormModel>({
  id: undefined,
  schoolId: undefined,
  email: '',
  appModule: '1'
})

const dialogTitle = computed(() => {
  if (mode.value === 'add') {
    return tr('activity.emailSchoolAddTitle')
  }
  if (mode.value === 'view') {
    return tr('activity.emailSchoolDetailTitle')
  }
  return tr('activity.emailSchoolEditTitle')
})

const uniMode = computed(() => (mode.value === 'view' ? 'view' : 'edit'))

const formConfig = computed<UniFormConfig>(() => ({
  formProps: { labelPosition: 'top' },
  rowProps: { gutter: 16 },
  colProps: { span: 24 },
  rules: {
    schoolId: [{ required: true, message: tr('activity.ruleSelect'), trigger: 'change' }],
    email: [
      { required: true, message: tr('activity.ruleInput'), trigger: 'blur' },
      { type: 'email', message: tr('activity.emailInvalid'), trigger: 'blur' }
    ],
    appModule: [{ required: true, message: tr('activity.ruleSelect'), trigger: 'change' }]
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
      field: 'email',
      label: tr('activity.emailAddress'),
      component: 'ElInput',
      componentProps: { maxlength: 200, showWordLimit: true }
    },
    {
      field: 'appModule',
      label: tr('activity.appModule'),
      component: 'ElSelect',
      options: appModuleOptions.value,
      viewType: 'enum',
      componentProps: {
        clearable: true,
        placeholder: tr('activity.ruleSelect'),
        style: { width: '100%' }
      }
    }
  ]
}))

function resetForm() {
  form.value = {
    id: undefined,
    schoolId: undefined,
    email: '',
    appModule: '1'
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

function normalizeAppModuleOptions(rows: Record<string, unknown>[]): UniOption[] {
  const normalizedRows = rows.map((row) => {
    const value = row.value ?? row.moduleCode ?? row.code ?? row.key ?? row.id
    return {
      value,
      label: row.label ?? row.name ?? row.desc ?? row.moduleName ?? value
    }
  })
  const options = toUniOptions(normalizedRows, {
    labelKeys: ['label'],
    valueKey: 'value'
  })
  if (!options.some((item) => String(item.value) === '1')) {
    options.unshift({ label: tr('activity.appModuleActivity'), value: '1' })
  }
  return options.map((item) => ({ ...item, value: String(item.value) }))
}

async function loadAppModuleOptions() {
  try {
    const raw = await schoolEmailConfigApi.appModules.get()
    appModuleOptions.value = normalizeAppModuleOptions(normalizeArray(raw) as Record<string, unknown>[])
  } catch {
    appModuleOptions.value = normalizeAppModuleOptions([])
  }
}

function ensureAppModuleOption(value: unknown) {
  if (value == null || value === '') {
    return
  }
  const val = String(value)
  if (!appModuleOptions.value.some((item) => String(item.value) === val)) {
    appModuleOptions.value.push({ label: val, value: val })
  }
}

function normalizeSchoolIdForSelect(schoolId: unknown) {
  if (schoolId == null || schoolId === '') {
    return undefined
  }
  const hit = schoolOptions.value.find((item) => String(item.value) === String(schoolId))
  return hit?.value as string | number | undefined
}

async function fillFromDetail(id: string | number) {
  const raw = await schoolEmailConfigApi.detail.get(id)
  const d = normalizeEnvelope(raw) as SchoolEmailConfigRow
  const appModule = String(d.appModule ?? '1')
  ensureAppModuleOption(appModule)
  form.value = {
    id,
    schoolId: normalizeSchoolIdForSelect(d.schoolId),
    email: String(d.email ?? ''),
    appModule
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
    email: form.value.email,
    appModule: form.value.appModule
  }

  saving.value = true
  try {
    if (mode.value === 'add') {
      await schoolEmailConfigApi.add.post(payload)
    } else {
      payload.id = form.value.id
      await schoolEmailConfigApi.edit.post(payload)
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
  open: async (m: 'add' | 'edit' | 'view', row?: SchoolEmailConfigRow) => {
    mode.value = m
    resetForm()
    await Promise.all([loadSchoolOptions(), loadAppModuleOptions()])
    if (m !== 'add' && row?.id != null) {
      await fillFromDetail(row.id as string | number)
    }
    visible.value = true
  }
})
</script>
