<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type {
  Recordable,
  UniFormConfig,
  UniOption,
  UniTableColumn,
  UniTableRequest,
  UniTableRequestResult,
  UniTableToolbarConfig
} from 'uni-ui-lib'

import { fetchCustomerList } from '@/api'
import { useAppI18n } from '@/composables/use-app-i18n'

const { t } = useAppI18n()
const queryModel = ref<Recordable>({
  keyword: '',
  level: '',
  status: ''
})
const filters = ref<Recordable>({ ...queryModel.value })
const tableRef = ref<{ refresh: () => void } | null>(null)
const selectedRows = ref<Recordable[]>([])
const total = ref(0)
const loadCustomers: UniTableRequest = ({ pageNo, pageSize, filters }) =>
  fetchCustomerList({ pageNo, pageSize, ...filters })

const levelOptions = computed<UniOption[]>(() => [
  { label: t('uniLibDemo.options.vip'), value: 'vip', type: 'success' },
  { label: t('uniLibDemo.options.normal'), value: 'normal', type: 'info' },
  { label: t('uniLibDemo.options.trial'), value: 'trial', type: 'warning' }
])
const statusOptions = computed<UniOption[]>(() => [
  { label: t('uniLibDemo.options.enabled'), value: 1, type: 'success' },
  { label: t('uniLibDemo.options.disabled'), value: 0, type: 'info' }
])
const valueEnums = computed<Record<string, UniOption[]>>(() => ({
  level: levelOptions.value,
  status: statusOptions.value
}))
const searchConfig = computed<UniFormConfig>(() => ({
  schema: [
    {
      field: 'keyword',
      label: t('uniLibDemo.fields.keyword'),
      component: 'ElInput',
      componentProps: {
        placeholder: t('uniLibDemo.placeholders.customerKeyword'),
        clearable: true
      },
      colProps: { span: 8 }
    },
    {
      field: 'level',
      label: t('uniLibDemo.fields.level'),
      component: 'ElSelect',
      options: levelOptions.value,
      componentProps: {
        placeholder: t('uniLibDemo.common.all'),
        clearable: true
      },
      colProps: { span: 6 }
    },
    {
      field: 'status',
      label: t('uniLibDemo.fields.status'),
      component: 'ElSelect',
      options: statusOptions.value,
      componentProps: {
        placeholder: t('uniLibDemo.common.all'),
        clearable: true
      },
      colProps: { span: 6 }
    }
  ],
  formProps: { labelWidth: '82px' },
  rowProps: { gutter: 16 },
  colProps: { span: 8 }
}))
const customerColumns = computed<UniTableColumn[]>(() => [
  { prop: 'customerNo', label: t('uniLibDemo.fields.customerNo'), type: 'copy', minWidth: 150 },
  {
    prop: 'name',
    label: t('uniLibDemo.fields.customerName'),
    type: 'text',
    minWidth: 190,
    showOverflowTooltip: true
  },
  { prop: 'level', label: t('uniLibDemo.fields.level'), type: 'tag', width: 110 },
  { prop: 'owner', label: t('uniLibDemo.fields.owner'), type: 'text', width: 100 },
  { prop: 'status', label: t('uniLibDemo.fields.status'), type: 'tag', width: 90 },
  {
    prop: 'contractAmount',
    label: t('uniLibDemo.fields.contractAmount'),
    type: 'money',
    minWidth: 120
  },
  {
    prop: 'progress',
    label: t('uniLibDemo.fields.progress'),
    type: 'percent',
    percent: { scale: 1, digits: 0 },
    width: 110
  },
  {
    prop: 'tags',
    label: t('uniLibDemo.fields.tags'),
    type: 'array',
    array: { renderMode: 'tag' },
    minWidth: 160
  },
  {
    prop: 'lastFollowAt',
    label: t('uniLibDemo.fields.lastFollowAt'),
    type: 'datetime',
    minWidth: 170
  }
])
const tableToolbar: UniTableToolbarConfig = {
  refresh: true,
  density: true,
  columnSetting: true,
  fullscreen: true,
  export: true,
  print: true,
  exportFileName: 'customer-list'
}
const actions = computed(() => [
  {
    label: t('uniLibDemo.actions.view'),
    onClick: (row: Recordable) =>
      ElMessage.info(t('uniLibDemo.messages.view', undefined, { name: row.name }))
  },
  {
    label: t('uniLibDemo.actions.edit'),
    type: 'success' as const,
    onClick: (row: Recordable) =>
      ElMessage.info(t('uniLibDemo.messages.edit', undefined, { name: row.name }))
  }
])

const search = async (value: Recordable) => {
  filters.value = { ...value }
  await nextTick()
  tableRef.value?.refresh()
}

const reset = async () => {
  filters.value = { ...queryModel.value }
  await nextTick()
  tableRef.value?.refresh()
}

const batchExport = () => {
  ElMessage.success(
    t('uniLibDemo.messages.exported', undefined, {
      count: selectedRows.value.length || total.value
    })
  )
}

const createCustomer = () => {
  ElMessage.info(t('uniLibDemo.messages.createCustomer'))
}

const handleLoadSuccess = (result: UniTableRequestResult) => {
  total.value = result.total
}
</script>

<template>
  <section class="demo-page">
    <el-card shadow="never">
      <template #header>
        <div class="demo-page__header">
          <div>
            <h1>{{ t('uniLibDemo.page.standardTitle') }}</h1>
            <p>{{ t('uniLibDemo.page.standardDescription') }}</p>
          </div>
          <el-button type="primary" @click="createCustomer">
            {{ t('uniLibDemo.actions.addCustomer') }}
          </el-button>
        </div>
      </template>

      <UniSearchForm
        v-model="queryModel"
        :config="searchConfig"
        show-selected-tags
        :submit-text="t('uniLibDemo.common.search')"
        :reset-text="t('uniLibDemo.common.reset')"
        @search="search"
        @reset="reset"
      />
    </el-card>

    <el-card shadow="never">
      <UniDataTable
        ref="tableRef"
        row-key="id"
        selection="multiple"
        :columns="customerColumns"
        :request="loadCustomers"
        :filters="filters"
        :pagination="{ pageSize: 5, pageSizes: [5, 10, 20] }"
        :toolbar="tableToolbar"
        :value-enums="valueEnums"
        :actions="actions"
        @selection-change="(rows) => (selectedRows = rows)"
        @load-success="handleLoadSuccess"
      >
        <template #toolbar>
          <div class="demo-page__toolbar">
            <el-button size="small" type="primary" plain @click="batchExport">
              {{ t('uniLibDemo.actions.batchExport') }}
            </el-button>
            <span>
              {{
                t('uniLibDemo.page.selectedSummary', undefined, {
                  selected: selectedRows.length,
                  total
                })
              }}
            </span>
          </div>
        </template>
      </UniDataTable>
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

.demo-page__toolbar {
  display: flex;
  gap: 8px;
  align-items: center;
  color: var(--app-text-color-secondary);
}
</style>
