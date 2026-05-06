<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { Recordable, UniOption, UniTableColumn } from 'uni-ui-lib'

import { fetchDepartmentTree } from '@/api'
import { useAppI18n } from '@/composables/use-app-i18n'
import type { DepartmentRecord } from '@/types/modules/uni-lib-demo'

const { t } = useAppI18n()
const departmentRows = ref<DepartmentRecord[]>([])
const statusOptions = computed<UniOption[]>(() => [
  { label: t('uniLibDemo.options.enabled'), value: 1, type: 'success' },
  { label: t('uniLibDemo.options.disabled'), value: 0, type: 'info' }
])
const valueEnums = computed<Record<string, UniOption[]>>(() => ({
  status: statusOptions.value
}))
const departmentColumns = computed<UniTableColumn[]>(() => [
  { prop: 'name', label: t('uniLibDemo.fields.departmentName'), type: 'text', minWidth: 220 },
  { prop: 'manager', label: t('uniLibDemo.fields.owner'), type: 'text', width: 120 },
  { prop: 'memberCount', label: t('uniLibDemo.fields.memberCount'), type: 'number', width: 100 },
  { prop: 'status', label: t('uniLibDemo.fields.status'), type: 'tag', width: 100 },
  { prop: 'createdAt', label: t('uniLibDemo.fields.createdAt'), type: 'date', minWidth: 140 }
])
const actions = computed(() => [
  {
    label: t('uniLibDemo.actions.addChild'),
    onClick: (row: Recordable) =>
      ElMessage.info(t('uniLibDemo.messages.addChild', undefined, { name: row.name }))
  },
  {
    label: t('uniLibDemo.actions.edit'),
    type: 'success' as const,
    onClick: (row: Recordable) =>
      ElMessage.info(t('uniLibDemo.messages.edit', undefined, { name: row.name }))
  }
])

onMounted(async () => {
  departmentRows.value = await fetchDepartmentTree()
})
</script>

<template>
  <section class="demo-page">
    <el-card shadow="never">
      <template #header>
        <div class="demo-page__header">
          <div>
            <h1>{{ t('uniLibDemo.page.treeTitle') }}</h1>
            <p>{{ t('uniLibDemo.page.treeDescription') }}</p>
          </div>
          <el-button type="primary" @click="ElMessage.info(t('uniLibDemo.messages.addDepartment'))">
            {{ t('uniLibDemo.actions.addDepartment') }}
          </el-button>
        </div>
      </template>

      <UniDataTable
        row-key="id"
        :columns="departmentColumns"
        :data="departmentRows"
        :pagination="false"
        :value-enums="valueEnums"
        :toolbar="{ refresh: false, density: true, columnSetting: true, fullscreen: true }"
        :actions="actions"
      />
    </el-card>
  </section>
</template>

<style scoped lang="scss">
.demo-page {
  display: grid;
  gap: 16px;
}

.demo-page__header {
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: space-between;

  h1 {
    margin: 0 0 8px;
    font-size: 20px;
  }

  p {
    margin: 0;
    color: var(--app-text-color-secondary);
  }
}
</style>
