<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { UniFormConfig, UniOption } from 'uni-ui-lib'

import { fetchCustomerDetail } from '@/api'
import { useAppI18n } from '@/composables/use-app-i18n'
import type { CustomerRecord } from '@/types/modules/uni-lib-demo'

const route = useRoute()
const router = useRouter()
const { t } = useAppI18n()

const detail = ref<CustomerRecord | null>(null)
const levelOptions = computed<UniOption[]>(() => [
  { label: t('uniLibDemo.options.vip'), value: 'vip', type: 'success' },
  { label: t('uniLibDemo.options.normal'), value: 'normal', type: 'info' },
  { label: t('uniLibDemo.options.trial'), value: 'trial', type: 'warning' }
])
const statusOptions = computed<UniOption[]>(() => [
  { label: t('uniLibDemo.options.enabled'), value: 1, type: 'success' },
  { label: t('uniLibDemo.options.disabled'), value: 0, type: 'info' }
])
const detailConfig = computed<UniFormConfig>(() => ({
  mode: 'view',
  view: { emptyText: '-' },
  formProps: { labelWidth: '78px' },
  rowProps: { gutter: 16 },
  colProps: { span: 12 },
  schema: [
    {
      field: 'customerNo',
      label: t('uniLibDemo.fields.customerNo'),
      component: 'ElInput',
      colProps: { span: 12 }
    },
    {
      field: 'name',
      label: t('uniLibDemo.fields.customerName'),
      component: 'ElInput',
      colProps: { span: 12 }
    },
    {
      field: 'level',
      label: t('uniLibDemo.fields.level'),
      component: 'ElSelect',
      viewType: 'tag',
      options: levelOptions.value,
      colProps: { span: 12 }
    },
    {
      field: 'owner',
      label: t('uniLibDemo.fields.owner'),
      component: 'ElInput',
      colProps: { span: 12 }
    },
    {
      field: 'status',
      label: t('uniLibDemo.fields.status'),
      component: 'ElSelect',
      viewType: 'tag',
      options: statusOptions.value,
      colProps: { span: 12 }
    },
    {
      field: 'contractAmount',
      label: t('uniLibDemo.fields.contractAmount'),
      component: 'ElInputNumber',
      viewType: 'money',
      colProps: { span: 12 }
    },
    {
      field: 'progress',
      label: t('uniLibDemo.fields.progress'),
      component: 'ElInputNumber',
      viewType: 'percent',
      viewRender: ({ value }) => `${String(value ?? 0)}%`,
      colProps: { span: 12 }
    },
    {
      field: 'lastFollowAt',
      label: t('uniLibDemo.fields.lastFollowAt'),
      component: 'ElDatePicker',
      viewType: 'datetime',
      colProps: { span: 12 }
    },
    {
      field: 'remark',
      label: t('uniLibDemo.fields.remark'),
      component: 'ElInput',
      componentProps: { type: 'textarea' },
      colProps: { span: 24 }
    }
  ],
  sections: [
    {
      title: t('uniLibDemo.sections.customerInfo'),
      description: t('uniLibDemo.sections.detailDescription'),
      fields: [
        'customerNo',
        'name',
        'level',
        'owner',
        'status',
        'contractAmount',
        'progress',
        'lastFollowAt',
        'remark'
      ]
    }
  ]
}))

onMounted(async () => {
  detail.value = await fetchCustomerDetail(String(route.params.id))
})
</script>

<template>
  <section class="demo-page">
    <el-card shadow="never">
      <template #header>
        <div class="demo-page__header">
          <div>
            <h1>{{ t('uniLibDemo.page.detailTitle') }}</h1>
            <p>{{ t('uniLibDemo.page.detailDescription') }}</p>
          </div>
          <el-button @click="router.back()">{{ t('uniLibDemo.common.back') }}</el-button>
        </div>
      </template>

      <UniForm v-if="detail" :model-value="detail" :config="detailConfig" mode="view" />
      <el-empty v-else :description="t('uniLibDemo.messages.notFound')" />
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
