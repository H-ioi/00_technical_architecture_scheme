<template>
  <el-dialog
    v-model="visible"
    :title="title"
    width="560px"
    destroy-on-close
    append-to-body
    :close-on-click-modal="false"
    @closed="onClosed">
    <el-alert type="info" show-icon :closable="false" class="activity-q-batch-flag__hint">
      {{ hint }}
    </el-alert>
    <UniForm
      ref="uniFormRef"
      v-model="form"
      mode="edit"
      class="activity-q-batch-flag__form"
      :config="formConfig" />
    <template #footer>
      <el-button @click="visible = false">{{ $t('common.cancel') }}</el-button>
      <el-button type="primary" :loading="saving" @click="submit">{{
        $t('common.submit')
      }}</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { computed, reactive, ref } from 'vue'

import { activityQuestionnaireApi } from '@/api'
import type { Translate } from '@/types/i18n'
import type { UniFormConfig } from 'uni-ui-lib'
import { UniForm, useUniI18n } from 'uni-ui-lib'

function yesNoOptions(t: Translate): Array<{ label: string; value: string }> {
  return [
    { label: t('activity.yes'), value: '1' },
    { label: t('activity.no'), value: '0' }
  ]
}

const emit = defineEmits<{ saved: [] }>()

type Kind = 'status' | 'frozen'

const { t } = useUniI18n()
const tr = t as Translate

const visible = ref(false)
const saving = ref(false)
const kindRef = ref<Kind>('status')
const idsRef = ref<Array<string | number>>([])
const uniFormRef = ref<InstanceType<typeof UniForm> | null>(null)

const form = reactive({
  value: '1'
})

const title = computed(() =>
  kindRef.value === 'status' ? tr('activity.qBatchChangeStatus') : tr('activity.qBatchChangeFrozen')
)

const hint = computed(() =>
  kindRef.value === 'status' ? tr('activity.qBatchHintStatus') : tr('activity.qBatchHintFrozen')
)

const flagLabel = computed(() =>
  kindRef.value === 'status'
    ? tr('activity.questionnaireValid')
    : tr('activity.questionnaireFrozen')
)

const opts = computed(() => yesNoOptions(tr))

const formConfig = computed<UniFormConfig>(() => ({
  formProps: { labelPosition: 'top' },
  colProps: { span: 24 },
  rules: {
    value: [{ required: true, message: tr('activity.ruleSelect'), trigger: 'change' }]
  } as UniFormConfig['rules'],
  schema: [
    {
      field: 'value',
      label: flagLabel.value,
      component: 'ElSelect',
      options: opts.value,
      componentProps: { style: { width: '100%' } }
    }
  ]
}))

const onClosed = () => {
  idsRef.value = []
  form.value = '1'
  uniFormRef.value?.clearValidate()
}

const submit = async () => {
  try {
    await uniFormRef.value?.validate()
  } catch {
    return
  }
  const ids = idsRef.value
  if (!ids.length) {
    ElMessage.warning(tr('activity.qSelRowsFirst'))

    return
  }
  const n = Number(form.value)
  saving.value = true
  try {
    if (kindRef.value === 'status') {
      await activityQuestionnaireApi.editStatus.post(ids, n)
    } else {
      await activityQuestionnaireApi.editFrozen.post(ids, n)
    }
    ElMessage.success(tr('activity.saveOk'))
    visible.value = false
    emit('saved')
  } finally {
    saving.value = false
  }
}

defineExpose({
  open: (kind: Kind, ids: Array<string | number>) => {
    if (!ids.length) {
      ElMessage.warning(tr('activity.qSelRowsFirst'))

      return
    }

    kindRef.value = kind
    idsRef.value = [...ids]
    form.value = '1'
    visible.value = true
  }
})
</script>

<style scoped lang="scss">
.activity-q-batch-flag {
  &__hint {
    margin-bottom: 12px;
  }

  &__form {
    margin-top: 4px;
  }
}
</style>
