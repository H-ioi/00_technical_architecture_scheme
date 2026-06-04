<template>
  <el-autocomplete
    v-model="ruleForm.admissionNo"
    style="width: 100%"
    :fetch-suggestions="queryStudents"
    :trigger-on-focus="false"
    :debounce="300"
    clearable
    value-key="value"
    :placeholder="$t('schoolBus.studentApply.phKeyword')"
    :disabled="mainDisabled"
    @select="onStudentPick">
    <template #default="{ item }">
      <div>{{ suggestLine(item) }}</div>
    </template>
  </el-autocomplete>
</template>

<script setup lang="ts">
import { suggestLine } from '../bus-order-form-helpers'
import { busOrderRuleFormKey } from '../bus-order-form-types'
import type { StudentSuggest } from '../bus-order-form-types'
import { inject } from 'vue'

const ruleForm = inject(busOrderRuleFormKey)!

defineProps<{
  mainDisabled: boolean
  queryStudents: (query: string, cb: (arg: StudentSuggest[]) => void) => void
  onStudentPick: (item: Record<string, unknown>) => void
}>()
</script>
