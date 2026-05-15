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
    <el-form ref="formRef" class="activity-q-batch-flag__form" label-position="top" :model="form" :rules="rules">
      <el-form-item :label="flagLabel" prop="value">
        <el-select v-model="form.value" style="width: 100%">
          <el-option v-for="o in opts" :key="String(o.value)" :label="o.label" :value="String(o.value)" />
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
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { computed, reactive, ref } from 'vue'

import { activityQuestionnaireApi } from '@/api'
import type { Translate } from '@/types/i18n'
import { useUniI18n } from 'uni-ui-lib'

import { yesNoOptions } from '@/views/activity/format-labels'

const emit = defineEmits<{ saved: [] }>()

type Kind = 'status' | 'frozen'

const { t } = useUniI18n()
const tr = t as Translate

const visible = ref(false)
const saving = ref(false)
const kindRef = ref<Kind>('status')
const idsRef = ref<Array<string | number>>([])
const formRef = ref<FormInstance>()

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

const rules = computed(
  (): FormRules => ({
    value: [{ required: true, message: tr('activity.ruleSelect'), trigger: 'change' }]
  })
)

const onClosed = () => {
  idsRef.value = []
  form.value = '1'
  formRef.value?.resetFields()
}

const submit = async () => {
  await formRef.value?.validate()
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
.activity-q-batch-flag__hint {
  margin-bottom: 12px;
}

.activity-q-batch-flag__form {
  margin-top: 4px;
}
</style>
