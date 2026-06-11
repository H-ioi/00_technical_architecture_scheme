<template>
  <section class="uni-list-page">
    <div class="uni-list-page__header">
      <div>
        <h1>{{ $t('content.discussion.pageTitle') }}</h1>
        <p>{{ $t('content.discussion.pageDesc') }}</p>
      </div>
      <div class="uni-list-page__header-actions">
        <el-button v-uni-permission="'discussion_add'" type="primary" @click="openForm('add')">
          {{ $t('content.add') }}
        </el-button>
      </div>
    </div>
    <div class="uni-list-page__body">
      <UniSearchForm
        v-model="queryModel"
        :config="searchCfg"
        :collapsed="true"
        :collapsed-rows="1"
        :action-min-span="0"
        :submit-text="$t('content.search')"
        :reset-text="$t('content.reset')"
        @search="search"
        @reset="onReset" />

      <UniDataTable
        ref="tableRef"
        row-key="id"
        :columns="columns"
        :request="loadData"
        :filters="filters"
        :pagination="{ pageSize: 10, pageSizes: [10, 20, 50, 100] }"
        :toolbar="{ refresh: true, density: true, columnSetting: true }"
        :actions="actions"
        :action-column="{ width: 160, fixed: 'right' }"
        @load-success="tableEmpty.onLoadSuccess"
        @request-error="tableEmpty.onRequestError">
        <template #empty>
          <ListTableEmpty :kind="tableEmpty.kind" @reset="onReset" @retry="tableEmpty.retry" />
        </template>
      </UniDataTable>
    </div>
    <DiscussionFormDialog
      v-model:visible="formVisible"
      :mode="formMode"
      :record-id="activeId"
      :school-options="schoolOptions"
      :tag-options="tagOptions"
      @saved="refreshTable" />

    <DiscussionDetailDialog v-model:visible="detailVisible" :record-id="activeId" />
  </section>
</template>

<script setup lang="ts">
import DiscussionDetailDialog from './components/detail-dialog.vue'
import DiscussionFormDialog from './components/form-dialog.vue'
import { boolFilterOpts, boolTagOpts, scopeOpts, searchForm, tableCols } from './list.config'
import { contentCommonApi, contentDiscussionApi } from '@/api'
import ListTableEmpty from '@/components/list-table-empty/index.vue'
import { useListTableEmpty } from '@/composables/use-list-table-empty'
import type { ContentDiscussionTagRecord } from '@/types/modules/content-discussion-tag'
import type { ContentDiscussionRecord as Row } from '@/types/modules/content-discussion'
import type { SchoolOptionRecord } from '@/types/modules/membership'
import { normalizeArray, normalizePaged } from '@/utils/api-response-normalize'
import { ElMessage, ElMessageBox } from 'element-plus'
import dayjs from 'dayjs'
import { useUniI18n, toUniOptions, useUniListState } from 'uni-ui-lib'
import type { UniTableAction, UniTableRequest } from 'uni-ui-lib'
import { computed, nextTick, onMounted, ref, watch } from 'vue'

const { locale, t } = useUniI18n()

const initialFilters = {
  keyword: '',
  schoolId: undefined as string | number | undefined,
  tagId: undefined as string | number | undefined,
  active: undefined as boolean | undefined,
  top: undefined as boolean | undefined,
  recommended: undefined as boolean | undefined
}
const { queryModel, filters, tableRef, search, reset, handleLoadSuccess, refreshTable } =
  useUniListState({ initialFilters })

const schoolRecords = ref<SchoolOptionRecord[]>([])
const tagRecords = ref<ContentDiscussionTagRecord[]>([])

const schoolOptions = computed(() =>
  toUniOptions(schoolRecords.value, {
    labelKeys: locale() === 'en' ? ['enName', 'cnName'] : ['cnName', 'enName', 'name'],
    valueKey: 'id'
  })
)
const tagOptions = computed(() =>
  toUniOptions(tagRecords.value, {
    labelKeys: locale() === 'en' ? ['enName', 'cnName'] : ['cnName', 'enName'],
    valueKey: 'id'
  })
)

const defaultSchoolId = computed(() =>
  schoolRecords.value.length === 1 ? schoolRecords.value[0].id : null
)

const boolOptions = computed(() => boolTagOpts(t))
const boolFilterOptions = computed(() => boolFilterOpts(t))
const scopeOptions = computed(() => scopeOpts(t))

const searchCfg = computed(() =>
  searchForm(
    t,
    schoolOptions.value,
    tagOptions.value,
    boolFilterOptions.value,
    defaultSchoolId.value ?? undefined
  )
)
const columns = computed(() => tableCols(t, boolOptions.value, scopeOptions.value))

const formVisible = ref(false)
const detailVisible = ref(false)
const formMode = ref<'add' | 'edit'>('add')
const activeId = ref<string | number | null>(null)

function formatRow(row: Row): Row {
  const next = { ...row }
  const tags = next.tagList || []
  if (tags.length > 0) {
    next.tagName =
      locale() === 'en'
        ? tags[0].enName || tags[0].cnName || '—'
        : tags[0].cnName || tags[0].enName || '—'
  }
  if (next.createdAt) {
    next.createdAt = dayjs(next.createdAt).format('YYYY-MM-DD HH:mm')
  }
  if (next.updatedAt) {
    next.updatedAt = dayjs(next.updatedAt).format('YYYY-MM-DD HH:mm')
  }
  return next
}

const loadData: UniTableRequest = async ({ pageNo: current, pageSize: size, filters: f }) => {
  const result = await contentDiscussionApi.page.get({ current, size, ...f })
  const { list, total: pageTotal } = normalizePaged<Row>(result)

  return {
    data: list.map(formatRow),
    total: pageTotal
  }
}

const openForm = (mode: 'add' | 'edit', row?: Row) => {
  formMode.value = mode
  activeId.value = row?.id ?? null
  formVisible.value = true
}

const openDetail = (row: Row) => {
  activeId.value = row.id
  detailVisible.value = true
}

const removeRow = async (row: Row) => {
  try {
    await ElMessageBox.confirm(t('content.discussion.confirmDelete'), t('content.delete'), {
      confirmButtonText: t('content.submit'),
      cancelButtonText: t('content.cancel'),
      type: 'warning'
    })
  } catch {
    return
  }

  await contentDiscussionApi.delete.post({ id: row.id })
  ElMessage.success(t('content.deleteSuccess'))
  void refreshTable()
}

const actions = computed<UniTableAction[]>(() => [
  {
    label: t('content.look'),
    onClick: (row) => openDetail(row as Row)
  },
  {
    label: t('content.edit'),
    code: 'discussion_edit',
    onClick: (row) => openForm('edit', row as Row)
  },
  {
    label: t('content.delete'),
    code: 'discussion_del',
    onClick: (row) => void removeRow(row as Row)
  }
])

const tableEmpty = useListTableEmpty(filters, { tableRef, afterLoadSuccess: handleLoadSuccess })

const onReset = () => {
  reset()
  if (defaultSchoolId.value != null) {
    queryModel.value.schoolId = defaultSchoolId.value
    filters.value.schoolId = defaultSchoolId.value
  }
  void nextTick(() => search())
}

onMounted(async () => {
  const [schools, tags] = await Promise.all([
    contentCommonApi.schoolList.get(),
    contentDiscussionApi.tagList.get()
  ])
  schoolRecords.value = normalizeArray<SchoolOptionRecord>(schools)
  tagRecords.value = normalizeArray<ContentDiscussionTagRecord>(tags)

  if (defaultSchoolId.value != null) {
    queryModel.value.schoolId = defaultSchoolId.value
    filters.value.schoolId = defaultSchoolId.value
    void nextTick(() => search())
  }
})

watch(defaultSchoolId, (schoolId) => {
  if (schoolId != null && queryModel.value.schoolId == null) {
    queryModel.value.schoolId = schoolId
    filters.value.schoolId = schoolId
  }
})
</script>
