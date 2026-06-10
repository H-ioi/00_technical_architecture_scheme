<template>
  <el-dialog v-model="visible" width="900px" :title="$t('schoolBus.look')" destroy-on-close>
    <el-descriptions v-if="record" :column="2" border>
      <el-descriptions-item v-for="col in columns" :key="String(col.prop)" :label="col.label">
        {{ detailCellDisplay(record, col.prop) }}
      </el-descriptions-item>
    </el-descriptions>
  </el-dialog>
</template>

<script setup lang="ts">
import type { ExceptionRecord } from '@/types/modules/school-bus-exception'
import type { UniTableColumn } from 'uni-ui-lib'
import { ref } from 'vue'

defineProps<{ columns: UniTableColumn[] }>()

function detailCellDisplay(record: ExceptionRecord, prop: string | undefined): string {
  if (!prop) {
    return '--'
  }
  const value = (record as Record<string, unknown>)[prop]
  if (value == null || value === '') {
    return '--'
  }
  if (Array.isArray(value)) {
    return value.map((item) => String(item)).join(', ')
  }
  return String(value)
}

const visible = ref(false)
const record = ref<ExceptionRecord | null>(null)

defineExpose({
  open: (row: ExceptionRecord) => {
    record.value = row
    visible.value = true
  }
})
</script>
