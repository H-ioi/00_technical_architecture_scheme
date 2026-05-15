<template>
  <el-dialog
    v-model="visible"
    :title="$t('activity.qCopyTitle')"
    width="520px"
    destroy-on-close
    append-to-body
    :close-on-click-modal="false"
    @closed="onClosed">
    <el-form ref="formRef" label-position="top" :model="form" :rules="rules">
      <el-form-item :label="$t('activity.qCopyNewName')" prop="newName">
        <el-input v-model="form.newName" maxlength="100" show-word-limit />
      </el-form-item>
      <el-form-item :label="$t('activity.questionnaireActivity')" prop="newActivityId">
        <el-select v-model="form.newActivityId" filterable clearable style="width: 100%">
          <el-option
            v-for="o in actOpts"
            :key="String(o.value)"
            :label="o.label"
            :value="o.value" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">{{ $t('common.cancel') }}</el-button>
      <el-button type="primary" :loading="saving" @click="submit">{{ $t('common.submit') }}</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import type { UniOption } from 'uni-ui-lib'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { computed, reactive, ref } from 'vue'

import { activityApi, activityQuestionnaireApi } from '@/api'
import type { Translate } from '@/types/i18n'
import { normalizeArray } from '@/utils/api-response-normalize'
import { useUniI18n } from 'uni-ui-lib'

const emit = defineEmits<{ saved: [] }>()

const { t, locale } = useUniI18n()
const tr = t as Translate

const visible = ref(false)
const saving = ref(false)
const sourceId = ref<string | number | undefined>(undefined)
const formRef = ref<FormInstance>()
const actOpts = ref<UniOption[]>([])

const form = reactive({
  newName: '',
  newActivityId: undefined as string | number | undefined
})

const rules = computed(
  (): FormRules => ({
    newName: [{ required: true, message: tr('activity.ruleInput'), trigger: 'blur' }],
    newActivityId: [{ required: true, message: tr('activity.ruleSelect'), trigger: 'change' }]
  })
)

async function loadActivities() {
  const raw = await activityApi.listBrief.get()
  const rows = normalizeArray(raw) as Record<string, unknown>[]
  actOpts.value = rows.map((x) => ({
    label: String(
      locale.value === 'en' ? x.activityEnName ?? x.activityCnName : x.activityCnName ?? x.activityEnName ?? x.id
    ),
    value: x.id as string | number
  }))
}

const onClosed = () => {
  sourceId.value = undefined
  form.newName = ''
  form.newActivityId = undefined
  formRef.value?.resetFields()
}

const submit = async () => {
  await formRef.value?.validate()
  if (sourceId.value == null) {
    return
  }
  saving.value = true
  try {
    await activityQuestionnaireApi.copy.post({
      id: sourceId.value,
      newName: form.newName,
      newActivityId: form.newActivityId
    })
    ElMessage.success(tr('activity.saveOk'))
    visible.value = false
    emit('saved')
  } finally {
    saving.value = false
  }
}

defineExpose({
  open: async (row: Record<string, unknown>) => {
    if (row.id == null) {
      return
    }
    sourceId.value = row.id as string | number
    form.newName = String(row.name ?? '')
    form.newActivityId = row.activityId as string | number | undefined
    await loadActivities()
    visible.value = true
  }
})
</script>
