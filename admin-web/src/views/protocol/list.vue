<template>
  <section class="uni-list-page protocol-page">
    <div class="uni-list-page__header">
      <div>
        <h1>{{ $t('protocol.pageTitle') }}</h1>
        <p>{{ $t('protocol.pageDesc') }}</p>
      </div>
      <div class="uni-list-page__header-actions">
        <el-button v-uni-permission="'protocol_add'" type="primary" @click="openForm('add')">
          {{ $t('protocol.add') }}
        </el-button>
      </div>
    </div>

    <!-- UniSearchForm 统一承载查询条件、重置和空值清理，页面只接收过滤后的查询参数。 -->
    <UniSearchForm
      v-model="queryModel"
      :config="searchCfg"
      :collapsed="true"
      :collapsed-rows="1"
      :action-min-span="0"
      :submit-text="$t('protocol.search')"
      :reset-text="$t('protocol.reset')"
      @search="search"
      @reset="reset"
    />

    <!-- UniDataTable 负责远程分页、选择列、操作列和表格工具栏；业务只提供列配置、请求和行操作。 -->
    <UniDataTable
      ref="tableRef"
      row-key="id"
      selection
      :columns="columns"
      :request="loadData"
      :filters="filters"
      :pagination="{ pageSize: 10, pageSizes: [10, 20, 50, 100] }"
      :toolbar="{ refresh: true, fullscreen: true, columnSetting: true }"
      :actions="actions"
      :action-column="{ width: 110, fixed: 'right' }"
      @selection-change="selection = $event as ProtocolRecord[]"
      @load-success="tableEmpty.onLoadSuccess"
      @request-error="tableEmpty.onRequestError"
    >
      <!-- toolbar 插槽放表格勾选后的批量操作，组件内部会和刷新/最大化/列设置工具合并到底部工具栏。 -->
      <template #toolbar>
        <div class="protocol-page__toolbar">
          <el-button
            v-uni-permission="'protocol_del'"
            type="danger"
            :disabled="ids.length === 0"
            @click="del"
          >
            {{ $t('protocol.delete') }}
          </el-button>
        </div>
      </template>
      <template #empty>
        <ListTableEmpty :kind="tableEmpty.kind" @reset="reset" @retry="tableEmpty.retry" />
      </template>
    </UniDataTable>

    <PForm
      v-model:visible="formVisible"
      :mode="formMode"
      :source="activeRow"
      :school-options="schoolOptions"
      :protocol-type-options="protocolTypeOptions"
      :module-options="moduleOptions"
      :yes-no-options="yesNoOptions"
      :status-options="statusOptions"
      @saved="refreshTable"
    />
  </section>
</template>

<script setup lang="ts">
import PForm from './components/form.vue'
import { buildProtocolDictOptions } from './dict-options'
import { searchForm, statusOpts, tableCols, yesNoOpts } from './list.config'
import { protocolApi, membershipApi } from '@/api'
import ListTableEmpty from '@/components/list-table-empty.vue'
import { useListTableEmpty } from '@/composables/use-list-table-empty'
import type { ProtocolRecord, ProtocolDict, ProtocolRecord as Row } from '@/types/modules/protocol'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUniI18n, toUniOptions, useUniListState } from 'uni-ui-lib'
import type { UniOption, UniTableAction, UniTableRequest } from 'uni-ui-lib'
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'


const { locale, t } = useUniI18n()

const router = useRouter()
const initialFilters = {
  schoolIds: undefined,
  cnName: '',
  enName: '',
  protocolType: undefined,
  module: undefined,
  status: undefined
}
const { queryModel, filters, tableRef, search, reset, handleLoadSuccess, refreshTable } =
  useUniListState({
    initialFilters
  })
const formVisible = ref(false)
const formMode = ref<'add' | 'edit'>('add')
const activeRow = ref<Row | null>(null)
const schoolOptions = ref<UniOption[]>([])
const protocolDict = ref<ProtocolDict>({})

const protocolTypeOptions = computed(() =>
  buildProtocolDictOptions(protocolDict.value.protocolTypeList, locale())
)
const moduleOptions = computed(() =>
  buildProtocolDictOptions(protocolDict.value.moduleList, locale())
)
const yesNoOptions = computed(() => yesNoOpts(t))
const statusOptions = computed(() => statusOpts(t))
const searchCfg = computed(() =>
  searchForm(
    t,
    schoolOptions.value,
    protocolTypeOptions.value,
    moduleOptions.value,
    statusOptions.value
  )
)
const columns = computed(() =>
  tableCols(
    t,
    locale(),
    schoolOptions.value,
    protocolTypeOptions.value,
    moduleOptions.value,
    yesNoOptions.value,
    statusOptions.value
  )
)

const loadData: UniTableRequest = async ({ pageNo: current, pageSize: size, filters }) => {
  const result = await protocolApi.page.get({ current, size, ...filters })

  return {
    data: result.data,
    total: result.total
  }
}

const openForm = (mode: 'add' | 'edit', row?: Row) => {
  formMode.value = mode
  activeRow.value = row ?? null
  formVisible.value = true
}

const actions = computed<UniTableAction[]>(() => [
  {
    label: t('protocol.detail'),
    onClick: (row) => void router.push(`/protocol/detail/${(row as Row).id}`)
  },
  {
    label: t('protocol.edit'),
    code: 'protocol_edit',
    onClick: (row) => openForm('edit', row as Row)
  }
])

onMounted(async () => {
  const [schools, dict] = await Promise.all([membershipApi.school.get(), protocolApi.dict.get()])

  schoolOptions.value = toUniOptions(schools, {
    labelKeys: locale() === 'en' ? ['enName', 'name'] : ['name', 'cnName', 'enName'],
    valueKey: 'id'
  })
  protocolDict.value = dict ?? {}
})

const tableEmpty = useListTableEmpty(filters, { tableRef, afterLoadSuccess: handleLoadSuccess })

const selection = ref<ProtocolRecord[]>([])
const ids = computed(() => selection.value.map((item) => item.id))

const del = async () => {
  if (ids.value.length === 0) {
    return
  }

  await ElMessageBox.confirm(t('protocol.confirmDelete'), t('protocol.delete'), {
    confirmButtonText: t('protocol.submit'),
    cancelButtonText: t('protocol.cancel'),
    type: 'warning'
  })

  await protocolApi.delete.delete(ids.value)
  ElMessage.success(t('protocol.deleteSuccess'))
  selection.value = []
  void refreshTable()
}</script>
