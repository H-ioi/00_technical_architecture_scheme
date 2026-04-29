<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage, type UploadRequestOptions, type UploadUserFile } from 'element-plus'
import type { UniFormConfig, UniTableColumn } from 'uni-ui-lib'

interface DemoUser {
  id: number
  name: string
  role: string
  status: 0 | 1
  tags: string[]
  homepage: string
  createdAt: string
  amount: number
}

const users: DemoUser[] = [
  {
    id: 1,
    name: '张三',
    role: 'admin',
    status: 1,
    tags: ['管理员', '核心用户'],
    homepage: 'https://example.com/users/1',
    createdAt: '2026-04-01 10:20:00',
    amount: 12800
  },
  {
    id: 2,
    name: '李四',
    role: 'operator',
    status: 0,
    tags: ['运营'],
    homepage: 'https://example.com/users/2',
    createdAt: '2026-04-08 16:30:00',
    amount: 5600
  },
  {
    id: 3,
    name: '王五',
    role: 'auditor',
    status: 1,
    tags: ['审核', '外部协作'],
    homepage: 'https://example.com/users/3',
    createdAt: '2026-04-16 09:05:00',
    amount: 9300
  }
]

const queryModel = ref({
  keyword: '',
  status: ''
})

const formMode = ref<'view' | 'edit'>('edit')
const formModel = ref({
  userName: '示例用户',
  userType: 1,
  advancedConfig: '',
  status: 1,
  remark: '切换为查看态可观察同一份配置的展示效果。'
})
const uploadFiles = ref<UploadUserFile[]>([])

const roleOptions = [
  { label: '管理员', value: 'admin' },
  { label: '运营', value: 'operator' },
  { label: '审核员', value: 'auditor' }
]

const statusOptions = [
  { label: '启用', value: 1, type: 'success' },
  { label: '停用', value: 0, type: 'info' }
]

const searchConfig: UniFormConfig = {
  schema: [
    {
      field: 'keyword',
      label: '关键词',
      component: 'ElInput',
      componentProps: {
        placeholder: '搜索姓名',
        clearable: true
      },
      colProps: { span: 8 }
    },
    {
      field: 'status',
      label: '状态',
      component: 'ElSelect',
      options: [{ label: '全部', value: '' }, ...statusOptions],
      componentProps: {
        placeholder: '请选择状态',
        clearable: true
      },
      colProps: { span: 8 }
    }
  ],
  formProps: {
    labelWidth: '72px'
  },
  rowProps: {
    gutter: 16
  },
  colProps: {
    span: 8
  }
}

const columns: UniTableColumn[] = [
  { prop: 'id', label: '编号', type: 'copy', width: 90 },
  { prop: 'name', label: '姓名', type: 'text', minWidth: 120 },
  {
    prop: 'role',
    label: '角色',
    type: 'enum',
    options: roleOptions,
    minWidth: 120
  },
  {
    prop: 'status',
    label: '状态',
    type: 'tag',
    options: statusOptions,
    width: 100
  },
  {
    prop: 'tags',
    label: '标签',
    type: 'array',
    array: {
      renderMode: 'tag'
    },
    minWidth: 180
  },
  { prop: 'amount', label: '成交额', type: 'money', minWidth: 120 },
  {
    prop: 'createdAt',
    label: '创建时间',
    type: 'datetime',
    minWidth: 180
  },
  {
    prop: 'homepage',
    label: '主页',
    type: 'link',
    link: {
      target: '_blank'
    },
    minWidth: 220
  }
]

const tableData = computed(() =>
  users.filter((user) => {
    const matchKeyword = queryModel.value.keyword
      ? user.name.includes(queryModel.value.keyword)
      : true
    const matchStatus =
      queryModel.value.status === '' ? true : user.status === Number(queryModel.value.status)

    return matchKeyword && matchStatus
  })
)

const formConfig = computed<UniFormConfig>(() => ({
  mode: formMode.value,
  formProps: {
    labelWidth: '96px'
  },
  rowProps: {
    gutter: 16
  },
  colProps: {
    span: 12
  },
  schema: [
    {
      field: 'userName',
      label: '用户名称',
      component: 'ElInput',
      formItemProps: {
        rules: [{ required: true, message: '请输入用户名称', trigger: 'blur' }]
      },
      componentProps: {
        placeholder: '请输入用户名称',
        clearable: true
      }
    },
    {
      field: 'userType',
      label: '用户类型',
      component: 'ElSelect',
      options: [
        { label: '普通用户', value: 1 },
        { label: '高级用户', value: 2 }
      ],
      componentProps: {
        placeholder: '请选择用户类型'
      },
      viewType: 'enum'
    },
    {
      field: 'advancedConfig',
      label: '高级配置',
      component: 'ElInput',
      dependencies: ['userType'],
      visible: ({ model }) => model.userType === 2,
      onHidden: ({ actions }) => actions.clearValue('advancedConfig'),
      componentProps: {
        placeholder: '仅高级用户展示'
      },
      colProps: {
        span: 24
      }
    },
    {
      field: 'status',
      label: '状态',
      component: 'ElSwitch',
      viewType: 'enum',
      options: statusOptions,
      componentProps: {
        activeValue: 1,
        inactiveValue: 0
      }
    },
    {
      field: 'remark',
      label: '备注',
      component: 'ElInput',
      componentProps: {
        type: 'textarea',
        rows: 3,
        placeholder: '请输入备注'
      },
      colProps: {
        span: 24
      }
    }
  ],
  sections: [
    {
      title: '基础信息',
      description: '演示 UniForm 配置化字段、分组布局、查看/编辑模式和字段联动。',
      fields: ['userName', 'userType', 'advancedConfig', 'status', 'remark']
    }
  ]
}))

const handleSearch = () => {
  ElMessage.success('已按筛选条件刷新表格')
}

const handleSwitchChange = (
  _row: Record<string, unknown>,
  _column: UniTableColumn,
  value: unknown
) => {
  ElMessage.info(`表格开关变更应在业务层处理：${String(value)}`)
}

const handleMockUpload = async (options: UploadRequestOptions) => {
  await new Promise((resolve) => window.setTimeout(resolve, 300))
  options.onSuccess?.({ url: URL.createObjectURL(options.file) })
  ElMessage.success('模拟上传成功')
}
</script>

<template>
  <section class="uni-lib-demo-page">
    <el-card shadow="never">
      <template #header>
        <div class="uni-lib-demo-page__header">
          <div>
            <h1>uni-ui-lib 组件库示例</h1>
            <p>展示 admin-web 接入业务组件库后的常见组合方式。</p>
          </div>
          <el-button v-uni-permission="'system:user:create'" type="primary">权限指令按钮</el-button>
        </div>
      </template>

      <UniSearchForm
        v-model="queryModel"
        :config="searchConfig"
        submit-text="筛选"
        reset-text="清空"
        @search="handleSearch"
      />
    </el-card>

    <el-card shadow="never">
      <template #header>
        <div class="uni-lib-demo-page__card-title">UniDataTable</div>
      </template>

      <UniDataTable
        row-key="id"
        :columns="columns"
        :data="tableData"
        :pagination="{ total: tableData.length, pageSize: 10 }"
        :actions="[
          {
            label: '查看',
            code: 'system:user:view',
            onClick: (row) => ElMessage.info(`查看 ${row.name}`)
          },
          {
            label: '编辑',
            code: 'system:user:create',
            onClick: (row) => ElMessage.info(`编辑 ${row.name}`)
          }
        ]"
        @switch-change="handleSwitchChange"
      />
    </el-card>

    <el-card shadow="never">
      <template #header>
        <div class="uni-lib-demo-page__card-title">
          <span>UniForm</span>
          <el-radio-group v-model="formMode" size="small">
            <el-radio-button label="edit">编辑态</el-radio-button>
            <el-radio-button label="view">查看态</el-radio-button>
          </el-radio-group>
        </div>
      </template>

      <UniForm v-model="formModel" :config="formConfig" :mode="formMode">
        <template #actions="{ submit, reset }">
          <el-button v-if="formMode === 'edit'" type="primary" @click="submit">提交</el-button>
          <el-button v-if="formMode === 'edit'" @click="reset">重置</el-button>
        </template>
      </UniForm>
    </el-card>

    <el-card shadow="never">
      <template #header>
        <div class="uni-lib-demo-page__card-title">UniUpload</div>
      </template>

      <UniUpload
        v-model:file-list="uploadFiles"
        :request="handleMockUpload"
        :limit="3"
        :max-size="1024 * 1024 * 5"
      >
        <template #tip>
          <div class="el-upload__tip">
            示例使用自定义 request 模拟上传，最多 3 个文件，单文件不超过 5MB。
          </div>
        </template>
      </UniUpload>
    </el-card>
  </section>
</template>

<style scoped lang="scss">
.uni-lib-demo-page {
  display: grid;
  gap: 16px;
}

.uni-lib-demo-page__header {
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

.uni-lib-demo-page__card-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 700;
}
</style>
