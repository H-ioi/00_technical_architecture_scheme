<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type {
  Recordable,
  UniOption,
  UniTableColumn,
  UniTableRequest,
  UniTableToolbarConfig
} from 'uni-ui-lib'

import { fetchCustomerList } from '@/api'
import { useAppI18n } from '@/composables/use-app-i18n'

const router = useRouter()
const { t } = useAppI18n()
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

const goDetail = (row: Recordable) => {
  router.push({ name: 'UniLibTableDetail', params: { id: String(row.id) } })
}

const goEdit = (row: Recordable) => {
  router.push({ name: 'UniLibTableEdit', params: { id: String(row.id) } })
}

const actions = computed(() => [
  { label: t('uniLibDemo.actions.detail'), onClick: goDetail },
  { label: t('uniLibDemo.actions.edit'), type: 'success' as const, onClick: goEdit }
])
</script>

<template>
  <section class="demo-page">
    <el-card shadow="never">
      <template #header>
        <div class="demo-page__header">
          <div>
            <h1>{{ t('uniLibDemo.page.linkFormTitle') }}</h1>
            <p>{{ t('uniLibDemo.page.linkFormDescription') }}</p>
          </div>
        </div>
      </template>

      <UniDataTable
        row-key="id"
        :columns="customerColumns"
        :request="loadCustomers"
        :pagination="{ pageSize: 5 }"
        :toolbar="tableToolbar"
        :value-enums="valueEnums"
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
