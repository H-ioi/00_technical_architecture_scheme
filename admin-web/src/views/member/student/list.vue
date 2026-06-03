<template>
  <section class="uni-list-page">
    <div class="uni-list-page__header">
      <div>
        <h1>{{ $t('member.student.pageTitle') }}</h1>
        <p>{{ $t('member.student.pageDesc') }}</p>
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
import {
  busOpts,
  detailForm,
  dormOpts,
  searchForm,
  stDispOpts,
  statusOpts,
  tableCols,
  ynDispOpts
} from './list.config'
import { membershipApi, studentApi } from '@/api'
import ListTableEmpty from '@/components/list-table-empty.vue'
import { useListTableEmpty } from '@/composables/use-list-table-empty'
import type { StudentRecord as Row } from '@/types/modules/member-student'
import type { UniOption, UniTableAction, UniTableRequest } from 'uni-ui-lib'
import { toUniOptions, useUniI18n, useUniListState } from 'uni-ui-lib'
import { computed, ref } from 'vue'

const { locale, t } = useUniI18n()

const initialFilters = {
  keywordssearch: '',
  schoolIds: undefined,
  yearGroupName: [],
  form: [],
  dormitoryStatus: undefined,
  busStatus: undefined,
  studentStatus: undefined
}
const { queryModel, filters, tableRef, search, reset, handleLoadSuccess } = useUniListState({
  initialFilters
})
const schoolOptions = ref<UniOption[]>([])
const yearGroupOptions = ref<UniOption[]>([])
const formOptions = ref<UniOption[]>([])
const detailVisible = ref(false)
const activeRow = ref<Row | null>(null)

const statusOptions = computed(() => statusOpts(t))
const statusDispOpts = computed(() => stDispOpts(t))
const busOptions = computed(() => busOpts(t))
const dormitoryOptions = computed(() => dormOpts(t))
const ynDispOptions = computed(() => ynDispOpts(t))
const searchCfg = computed(() =>
  searchForm(
    t,
    schoolOptions.value,
    yearGroupOptions.value,
    formOptions.value,
    dormitoryOptions.value,
    busOptions.value,
    statusOptions.value
  )
)
const columns = computed(() =>
  tableCols(t, schoolOptions.value, ynDispOptions.value, statusDispOpts.value)
)
const detailConfig = computed(() => detailForm(t))

const loadData: UniTableRequest = ({ pageNo: current, pageSize: size, filters }) =>
  studentApi.page.get({ current, size, ...filters })

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

const loadOpts = async () => {
  const [schools, yearGroups, forms] = await Promise.all([
    membershipApi.school.get(),
    studentApi.yearGroup.get(),
    studentApi.form.get()
  ])

  schoolOptions.value = toUniOptions(schools, {
    labelKeys: locale() === 'en' ? ['enName', 'name'] : ['name', 'cnName', 'enName'],
    valueKey: 'id'
  })
  yearGroupOptions.value = toUniOptions(
    yearGroups.map((item) => ({ label: item, value: item })),
    {
      labelKeys: ['label'],
      valueKey: 'value'
    }
  )
  formOptions.value = toUniOptions(
    forms.map((item) => ({ label: item, value: item })),
    {
      labelKeys: ['label'],
      valueKey: 'value'
    }
  )
}

loadOpts()

const tableEmpty = useListTableEmpty(filters, { tableRef, afterLoadSuccess: handleLoadSuccess })
</script>
