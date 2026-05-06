<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type {
  Recordable,
  UniFormConfig,
  UniOption,
  UniTableColumn,
  UniTableRequest,
  UniTableToolbarConfig
} from 'uni-ui-lib'

import { fetchCustomerList } from '@/api'
import { useAppI18n } from '@/composables/use-app-i18n'

const { t } = useAppI18n()
const loadCustomers: UniTableRequest = ({ pageNo, pageSize, filters }) =>
  fetchCustomerList({ pageNo, pageSize, ...filters })
const detailVisible = ref(false)
const editVisible = ref(false)
const currentRow = ref<Recordable | null>(null)
const formModel = ref<Recordable>({})
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
const editConfig = computed<UniFormConfig>(() => ({
  mode: 'edit',
  formProps: { labelWidth: '85px' },
  rowProps: { gutter: 16 },
  colProps: { span: 12 },
  rules: {
    name: [
      { required: true, message: t('uniLibDemo.validation.customerNameRequired'), trigger: 'blur' }
    ],
    level: [
      { required: true, message: t('uniLibDemo.validation.levelRequired'), trigger: 'change' }
    ],
    owner: [{ required: true, message: t('uniLibDemo.validation.ownerRequired'), trigger: 'blur' }]
  },
  schema: [
    {
      field: 'customerNo',
      label: t('uniLibDemo.fields.customerNo'),
      component: 'ElInput',
      readonly: true,
      componentProps: { placeholder: t('uniLibDemo.placeholders.autoGenerated') },
      colProps: { span: 12 }
    },
    {
      field: 'name',
      label: t('uniLibDemo.fields.customerName'),
      component: 'ElInput',
      componentProps: { placeholder: t('uniLibDemo.placeholders.customerName'), clearable: true },
      colProps: { span: 12 }
    },
    {
      field: 'level',
      label: t('uniLibDemo.fields.level'),
      component: 'ElSelect',
      options: levelOptions.value,
      componentProps: { placeholder: t('uniLibDemo.placeholders.level'), clearable: true },
      colProps: { span: 12 }
    },
    {
      field: 'owner',
      label: t('uniLibDemo.fields.owner'),
      component: 'ElInput',
      componentProps: { placeholder: t('uniLibDemo.placeholders.owner'), clearable: true },
      colProps: { span: 12 }
    },
    {
      field: 'status',
      label: t('uniLibDemo.fields.status'),
      component: 'ElSwitch',
      componentProps: { activeValue: 1, inactiveValue: 0 },
      colProps: { span: 12 }
    },
    {
      field: 'contractAmount',
      label: t('uniLibDemo.fields.contractAmount'),
      component: 'ElInputNumber',
      componentProps: { min: 0, precision: 2, controlsPosition: 'right' },
      colProps: { span: 12 }
    },
    {
      field: 'progress',
      label: t('uniLibDemo.fields.progress'),
      component: 'ElSlider',
      componentProps: { min: 0, max: 100 },
      colProps: { span: 12 }
    },
    {
      field: 'lastFollowAt',
      label: t('uniLibDemo.fields.lastFollowAt'),
      component: 'ElDatePicker',
      componentProps: {
        type: 'datetime',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
        placeholder: t('uniLibDemo.placeholders.lastFollowAt')
      },
      colProps: { span: 12 }
    },
    {
      field: 'remark',
      label: t('uniLibDemo.fields.remark'),
      component: 'ElInput',
      componentProps: {
        type: 'textarea',
        rows: 4,
        placeholder: t('uniLibDemo.placeholders.remark')
      },
      colProps: { span: 24 }
    }
  ],
  sections: [
    {
      title: t('uniLibDemo.sections.customerEdit'),
      description: t('uniLibDemo.sections.editDescription'),
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

const openDetail = (row: Recordable) => {
  currentRow.value = row
  detailVisible.value = true
}

const openEdit = (row: Recordable) => {
  formModel.value = { ...row }
  editVisible.value = true
}

const actions = computed(() => [
  { label: t('uniLibDemo.actions.detail'), onClick: openDetail },
  { label: t('uniLibDemo.actions.edit'), type: 'success' as const, onClick: openEdit }
])

const editCurrent = () => {
  if (currentRow.value) {
    openEdit(currentRow.value)
    detailVisible.value = false
  }
}

const save = (value: Recordable) => {
  ElMessage.success(
    t('uniLibDemo.messages.saved', undefined, {
      name: String(value.name ?? t('uniLibDemo.messages.customerFallback'))
    })
  )
  editVisible.value = false
}
</script>

<template>
  <section class="demo-page">
    <el-card shadow="never">
      <template #header>
        <div class="demo-page__header">
          <div>
            <h1>{{ t('uniLibDemo.page.dialogFormTitle') }}</h1>
            <p>{{ t('uniLibDemo.page.dialogFormDescription') }}</p>
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

    <el-dialog v-model="detailVisible" :title="t('uniLibDemo.page.detailTitle')" width="720px">
      <UniForm v-if="currentRow" :model-value="currentRow" :config="detailConfig" mode="view" />
      <template #footer>
        <el-button @click="detailVisible = false">
          {{ t('uniLibDemo.common.close') }}
        </el-button>
        <el-button type="primary" @click="editCurrent">
          {{ t('uniLibDemo.actions.edit') }}
        </el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="editVisible" :title="t('uniLibDemo.page.editTitle')" width="760px">
      <UniForm v-model="formModel" :config="editConfig" mode="edit" @submit="save">
        <template #actions="{ submit, reset }">
          <el-button type="primary" @click="submit">
            {{ t('uniLibDemo.common.save') }}
          </el-button>
          <el-button @click="reset">{{ t('uniLibDemo.common.reset') }}</el-button>
          <el-button @click="editVisible = false">{{ t('uniLibDemo.common.cancel') }}</el-button>
        </template>
      </UniForm>
    </el-dialog>
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
