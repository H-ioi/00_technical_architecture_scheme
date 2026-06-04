<template>
  <section class="uni-list-page">
    <div class="uni-list-page__header">
      <div>
        <h1>{{ $t('member.teacher.pageTitle') }}</h1>
        <p>{{ $t('member.teacher.pageDesc') }}</p>
      </div>
    </div>

    <UniSearchForm
      v-model="queryModel"
      :config="searchCfg"
      :collapsed="true"
      :collapsed-rows="1"
      :action-min-span="0"
      :submit-text="$t('member.search')"
      :reset-text="$t('member.reset')"
      @search="search"
      @reset="reset" />

    <UniDataTable
      ref="tableRef"
      row-key="id"
      :columns="columns"
      :request="loadData"
      :filters="filters"
      :pagination="{ pageSize: 10, pageSizes: [10, 20, 50, 100] }"
      :toolbar="{ refresh: true, density: true, columnSetting: true }"
      :actions="actions"
      :action-column="{ width: 100, fixed: 'right' }"
      @load-success="tableEmpty.onLoadSuccess"
      @request-error="tableEmpty.onRequestError">
      <template #empty>
        <ListTableEmpty :kind="tableEmpty.kind" @reset="reset" @retry="tableEmpty.retry" />
      </template>
    </UniDataTable>

    <MDetail v-model:visible="detailVisible" :source="activeRow" :config="detailConfig" />
  </section>
</template>

<script setup lang="ts">
import MDetail from '../components/detail.vue'
import { detailForm, roleOpts, searchForm, statusOpts, tableCols } from './list.config'
import { membershipApi, teacherApi } from '@/api'
import ListTableEmpty from '@/components/list-table-empty/index.vue'
import { useListTableEmpty } from '@/composables/use-list-table-empty'
import type { TeacherRecord as Row } from '@/types/modules/member-teacher'
import type { UniOption, UniTableAction, UniTableRequest } from 'uni-ui-lib'
import { toUniOptions, useUniI18n, useUniListState } from 'uni-ui-lib'
import { computed, onMounted, ref } from 'vue'

const { locale, t } = useUniI18n()

const initialFilters = {
  keywordssearch: '',
  schoolIds: undefined,
  role: undefined,
  archived: undefined
}
const { queryModel, filters, tableRef, search, reset, handleLoadSuccess } = useUniListState({
  initialFilters
})
const detailVisible = ref(false)
const activeRow = ref<Row | null>(null)
const schoolOptions = ref<UniOption[]>([])
const roleOptions = ref<UniOption[]>([])

const statusOptions = computed(() => statusOpts(t))
const searchCfg = computed(() =>
  searchForm(t, schoolOptions.value, roleOptions.value, statusOptions.value)
)
const columns = computed(() => tableCols(t, schoolOptions.value, statusOptions.value))
const detailConfig = computed(() => detailForm(t))

const loadData: UniTableRequest = ({ pageNo: current, pageSize: size, filters }) =>
  teacherApi.page.get({ current, size, ...filters })

const show = (row: Row) => {
  activeRow.value = row
  detailVisible.value = true
}

const actions = computed<UniTableAction[]>(() => [
  {
    label: t('member.detail'),
    code: 'dataform_file_look',
    onClick: (row) => show(row as Row)
  }
])

onMounted(async () => {
  const [schools, roles] = await Promise.all([membershipApi.school.get(), teacherApi.role.get()])

  schoolOptions.value = toUniOptions(schools, {
    labelKeys: locale() === 'en' ? ['enName', 'name'] : ['name', 'cnName', 'enName'],
    valueKey: 'id'
  })
  roleOptions.value = roleOpts(roles)
})

const tableEmpty = useListTableEmpty(filters, { tableRef, afterLoadSuccess: handleLoadSuccess })
</script>
