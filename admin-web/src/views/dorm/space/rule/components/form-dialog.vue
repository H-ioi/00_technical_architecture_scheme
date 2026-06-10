<template>
  <el-dialog v-model="visible" :title="title" width="720px" destroy-on-close>
    <div
      v-loading="detailLoading"
      class="dorm-rule-form__body"
      :element-loading-text="$t('common.loading')"
    >
      <UniForm ref="uniFormRef" v-model="formModel" mode="edit" :config="dialogFormCfg" />

      <div class="dorm-rule-form__items">
        <div class="dorm-rule-form__items-label">{{ $t('dorm.rule.fieldRuleItems') }}</div>
        <div
          v-for="(_item, index) in formModel.rulesList"
          :key="index"
          class="dorm-rule-form__item-row"
        >
          <el-select
            v-model="formModel.rulesList[index]"
            clearable
            filterable
            :placeholder="$t('dorm.rule.phRuleItem')"
            class="dorm-rule-form__item-select"
          >
            <el-option
              v-for="option in ruleItemOptions"
              :key="option.code"
              :label="option.name || option.code"
              :value="option.code"
            />
          </el-select>
          <el-button v-if="index === 0" circle type="primary" @click="addRuleRow">
            <el-icon><Plus /></el-icon>
          </el-button>
          <el-button v-else circle type="danger" @click="removeRuleRow(index)">
            <el-icon><Minus /></el-icon>
          </el-button>
        </div>
      </div>
    </div>

    <template #footer>
      <el-button @click="visible = false">{{ $t('dorm.common.cancel') }}</el-button>
      <el-button type="primary" :loading="submitting" @click="submit">
        {{ $t('dorm.common.submit') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { Minus, Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { UniForm, useUniI18n } from 'uni-ui-lib'
import type { UniFormConfig } from 'uni-ui-lib'
import { computed, ref, watch } from 'vue'

import { dormAssignRuleApi } from '@/api'
import type {
  DormAssignRuleFormModel,
  DormAssignRuleItemOption
} from '@/types/modules/dorm-assign-rule'
import { normalizeArray, normalizePayload } from '@/utils/api-response-normalize'

import {
  activeStatusOpts,
  dialogFormConfig,
  dialogFormRules,
  emptyFormModel
} from '../list.config'

import { useDialogDetailLoading } from '@/composables/use-dialog-detail-loading'

type Loose = Record<string, unknown>

const visible = defineModel<boolean>('visible', { required: true })

const props = defineProps<{
  mode: 'add' | 'edit'
  recordId: string | number | null
  schoolOptions: Array<{ label: string; value: string | number }>
  defaultSchoolId?: string | number
}>()

const emit = defineEmits<{
  saved: []
}>()

const { t } = useUniI18n()
const { detailLoading, runWithDetailLoading } = useDialogDetailLoading()

const uniFormRef = ref<InstanceType<typeof UniForm> | null>(null)
const submitting = ref(false)
const formModel = ref<DormAssignRuleFormModel>(emptyFormModel())
const ruleItemOptions = ref<DormAssignRuleItemOption[]>([])

const dialogFormCfg = computed<UniFormConfig>(() => ({
  ...dialogFormConfig(t, props.schoolOptions, activeStatusOpts(t)),
  rules: dialogFormRules(t)
}))

const title = computed(() => t(props.mode === 'add' ? 'dorm.rule.formAdd' : 'dorm.rule.formEdit'))

function addRuleRow() {
  formModel.value.rulesList.push('')
}

function removeRuleRow(index: number) {
  formModel.value.rulesList.splice(index, 1)
}

async function loadRuleItemOptions() {
  const raw = await dormAssignRuleApi.ruleItemList.get()
  ruleItemOptions.value = normalizeArray<DormAssignRuleItemOption>(raw)
}

watch(
  () => visible.value,
  (open) => {
    if (!open) {
      formModel.value = emptyFormModel()
      ruleItemOptions.value = []
      return
    }

    void runWithDetailLoading(async () => {
      formModel.value = emptyFormModel()
      await loadRuleItemOptions()

      if (props.mode === 'add') {
        if (props.defaultSchoolId != null) {
          formModel.value.schoolId = props.defaultSchoolId
        }
        return
      }
      if (props.recordId == null) {
        return
      }

      const raw = await dormAssignRuleApi.detail.get(props.recordId)
      const row = normalizePayload(raw) as Loose
      const ruleItems = String(row.ruleItems ?? '')
      formModel.value = {
        id: row.id as string | number,
        schoolId: row.school_id as string | number | undefined,
        ruleName: String(row.ruleName ?? ''),
        rulesList: ruleItems ? ruleItems.split(',') : [''],
        is_active: row.isActive != null ? String(row.isActive) : '1'
      }
    })
  }
)

async function submit() {
  const valid = await uniFormRef.value?.validate().catch(() => false)
  if (!valid) {
    return
  }

  const validRules = formModel.value.rulesList.filter((code) => code && code.trim() !== '')
  if (validRules.length === 0) {
    ElMessage.error(t('dorm.rule.ruleItemsRequired'))
    return
  }

  submitting.value = true
  try {
    const payload = {
      id: formModel.value.id,
      school_id: formModel.value.schoolId,
      rule_name: formModel.value.ruleName,
      is_active: Number(formModel.value.is_active ?? 1),
      rule_items: validRules.join(',')
    }

    if (formModel.value.id != null) {
      await dormAssignRuleApi.update.post(payload)
    } else {
      await dormAssignRuleApi.create.post(payload)
    }

    ElMessage.success(t('dorm.common.saveSuccess'))
    visible.value = false
    emit('saved')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped lang="scss">
.dorm-rule-form__body {
  min-height: 80px;
}

.dorm-rule-form__items {
  margin-top: 8px;
}

.dorm-rule-form__items-label {
  margin-bottom: 8px;
  font-size: 14px;
  color: #606266;

  &::before {
    margin-right: 4px;
    color: #f56c6c;
    content: '*';
  }
}

.dorm-rule-form__item-row {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 10px;
}

.dorm-rule-form__item-select {
  flex: 1;
}
</style>
