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
import { detailCellDisplay } from '@/utils/school-bus'
import type { UniTableColumn } from 'uni-ui-lib'
import { ref } from 'vue'

defineProps<{ columns: UniTableColumn[] }>()

const visible = ref(false)
const record = ref<ExceptionRecord | null>(null)

defineExpose({
  open: (row: ExceptionRecord) => {
    record.value = row
    visible.value = true
  }
})
</script>
