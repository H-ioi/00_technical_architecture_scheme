<template>
  <section class="activity-email-school-list uni-list-page">
    <div class="uni-list-page__header">
      <div>
        <h1>{{ $t('activity.emailSchoolTitle') }}</h1>
        <p class="uni-list-page__description">{{ $t('activity.emailSchoolDesc') }}</p>
      </div>
      <div v-uni-permission="'busdriver_add'" class="uni-list-page__header-actions">
        <el-button type="primary" @click="formDlg?.open('add')">{{ $t('activity.add') }}</el-button>
      </div>
    </div>
    <UniSearchForm
      v-model="queryModel"
      :config="searchCfg"
      :collapsed="true"
      :collapsed-rows="1"
      :action-min-span="0"
      :submit-text="$t('activity.search')"
      :reset-text="$t('activity.reset')"
      @search="search"
      @reset="reset"
    />
    <UniDataTable
      ref="tableRef"
      row-key="id"
      selection="multiple"
      :columns="columns"
      :request="loadData"
      :filters="filters"
      :pagination="{ pageSize: 10, pageSizes: [10, 20, 50, 100] }"
      :toolbar="{ refresh: true, columnSetting: true }"
      :actions="actions"
      :action-column="{ width: 110, fixed: 'right' }"
      @load-success="handleLoadSuccess"
      @selection-change="onSelectionChange"
    >
      <template #toolbar>
        <el-button
          v-uni-permission="'busdriver_del'"
          type="danger"
          plain
          :disabled="!selectedIds.length"
          @click="deleteSelected"
        >
          {{ $t('activity.delBatch') }}
        </el-button>
      </template>
    </UniDataTable>

    <EmailSchoolFormDialog ref="formDlg" @saved="refreshTable" />
  </section>
</template>

<script setup lang="ts">
import EmailSchoolFormDialog from './components/form-dialog.vue'
import { searchForm, tableCols } from './list.config'
import { schoolEmailConfigApi } from '@/api'
import { useMembershipSchoolOptions } from '@/composables/use-membership-school-options'
import type { Translate } from '@/types/i18n'
import type { SchoolEmailConfigRow } from '@/types/modules/school-email-config'
import { appModuleOptionsFromRows } from '@/utils/activity-email-school'
import { normalizeArray, normalizePaged } from '@/utils/api-response-normalize'
import { dateFormat } from '@/utils/tool'
import { ElMessage, ElMessageBox } from 'element-plus'
import { UniDataTable, UniSearchForm, useUniI18n, useUniListState } from 'uni-ui-lib'
import type { UniOption, UniTableAction, UniTableRequest } from 'uni-ui-lib'
import { ref, computed, onMounted } from 'vue'

const formDlg = ref<InstanceType<typeof EmailSchoolFormDialog> | null>(null)

const { t } = useUniI18n()
const tr = t as Translate

const { schoolOptions, loadSchoolOptions } = useMembershipSchoolOptions()
const appModuleOptions = ref<UniOption[]>([])

const { queryModel, filters, handleLoadSuccess, refreshTable, reset, search, tableRef } =
  useUniListState({
    initialFilters: { schoolId: undefined, keyword: '' }
  })

const searchCfg = computed(() => searchForm(tr, schoolOptions.value))
const columns = computed(() => tableCols(tr, schoolOptions.value, appModuleOptions.value))
const selectedRows = ref<SchoolEmailConfigRow[]>([])
const selectedIds = computed(
  () => selectedRows.value.map((row) => row.id).filter((id) => id != null) as Array<string | number>
)

const loadAppModuleOptions = async () => {
  try {
    const raw = await schoolEmailConfigApi.appModules.get()
    appModuleOptions.value = appModuleOptionsFromRows(
      normalizeArray(raw) as Record<string, unknown>[],
      tr('activity.appModuleActivity')
    )
  } catch {
    appModuleOptions.value = appModuleOptionsFromRows([], tr('activity.appModuleActivity'))
  }
}

const decorateRows = (list: SchoolEmailConfigRow[]) => {
  for (const row of list) {
    row.appModule = row.appModule == null || row.appModule === '' ? '' : String(row.appModule)
    row.createdAt = row.createdAt ? dateFormat(String(row.createdAt), 'yyyy-MM-dd hh:mm') : '—'
    row.updatedAt = row.updatedAt ? dateFormat(String(row.updatedAt), 'yyyy-MM-dd hh:mm') : '—'
  }
}

const loadData: UniTableRequest = async ({
  pageNo: current,
  pageSize: size,
  filters: filterModel
}) => {
  const f = filterModel as SchoolEmailConfigRow
  const raw = await schoolEmailConfigApi.page.get({
    current,
    size,
    schoolId: f.schoolId as string | number | undefined,
    keyword: (f.keyword as string) || undefined
  })
  const { list, total } = normalizePaged<SchoolEmailConfigRow>(raw)
  decorateRows(list)
  return { data: list, total }
}

const actions = computed<UniTableAction[]>(() => [
  {
    label: tr('activity.lookDetail'),
    onClick: (row) => void formDlg.value?.open('view', row as SchoolEmailConfigRow)
  },
  {
    label: tr('activity.entryEdit'),
    code: 'busdriver_edit',
    onClick: (row) => void formDlg.value?.open('edit', row as SchoolEmailConfigRow)
  }
])

const onSelectionChange = (rows: Record<string, unknown>[]) => {
  selectedRows.value = rows as SchoolEmailConfigRow[]
}

const deleteSelected = async () => {
  if (!selectedIds.value.length) {
    ElMessage.warning(tr('activity.emailSchoolSelRows'))
    return
  }
  try {
    await ElMessageBox.confirm(tr('activity.confirmDeleteEmailSchools'), tr('common.tip'), {
      type: 'warning'
    })
  } catch {
    return
  }
  await schoolEmailConfigApi.remove.delete(selectedIds.value)
  ElMessage.success(tr('activity.deleteOk'))
  selectedRows.value = []
  tableRef.value?.refresh()
}

onMounted(() => {
  void Promise.all([loadSchoolOptions(), loadAppModuleOptions()])
})
</script>
