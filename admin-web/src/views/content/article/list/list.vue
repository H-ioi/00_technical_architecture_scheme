<template>
  <section class="uni-list-page">
    <div class="uni-list-page__header">
      <div>
        <h1>{{ $t('content.article.pageTitle') }}</h1>
        <p>{{ $t('content.article.pageDesc') }}</p>
      </div>
      <div class="uni-list-page__header-actions">
        <el-button v-uni-permission="'article_add'" type="primary" @click="openForm('add')">
          {{ $t('content.add') }}
        </el-button>
      </div>
    </div>

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
      :action-column="{ width: 150, fixed: 'right' }"
      @load-success="tableEmpty.onLoadSuccess"
      @request-error="tableEmpty.onRequestError">
      <template #empty>
        <ListTableEmpty :kind="tableEmpty.kind" @reset="onReset" @retry="tableEmpty.retry" />
      </template>
    </UniDataTable>

    <ArticleFormDialog
      v-model:visible="formVisible"
      :mode="formMode"
      :record-id="activeId"
      :school-options="schoolOptions"
      :category-options="categoryOptions"
      @saved="refreshTable" />

    <ArticleDetailDialog v-model:visible="detailVisible" :record-id="detailId" />
  </section>
</template>

<script setup lang="ts">
import ArticleDetailDialog from './components/detail-dialog.vue'
import ArticleFormDialog from './components/form-dialog.vue'
import {
  boolFilterOpts,
  boolTagOpts,
  importanceLevelOpts,
  searchForm,
  tableCols
} from './list.config'
import { contentCategoryApi, contentArticleApi, contentCommonApi } from '@/api'
import ListTableEmpty from '@/components/list-table-empty/index.vue'
import { useListTableEmpty } from '@/composables/use-list-table-empty'
import type { SchoolOptionRecord } from '@/types/modules/membership'
import type { ContentCategoryRecord } from '@/types/modules/content-category'
import type { ContentArticleRecord as Row } from '@/types/modules/content-article'
import { normalizeArray, normalizePaged } from '@/utils/api-response-normalize'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUniI18n, toUniOptions, useUniListState } from 'uni-ui-lib'
import type { UniTableAction, UniTableRequest } from 'uni-ui-lib'
import { computed, nextTick, onMounted, ref, watch } from 'vue'

const { locale, t } = useUniI18n()

const initialFilters = {
  title: '',
  schoolId: undefined as string | number | undefined,
  categoryId: undefined as string | number | undefined,
  importanceLevel: undefined as number | undefined,
  visible: undefined as boolean | undefined,
  isBanner: undefined as boolean | undefined,
  recommended: undefined as boolean | undefined
}
const { queryModel, filters, tableRef, search, reset, handleLoadSuccess, refreshTable } =
  useUniListState({ initialFilters })

const schoolRecords = ref<SchoolOptionRecord[]>([])
const categoryRecords = ref<ContentCategoryRecord[]>([])

const schoolOptions = computed(() =>
  toUniOptions(schoolRecords.value, {
    labelKeys: locale() === 'en' ? ['enName', 'cnName'] : ['cnName', 'enName', 'name'],
    valueKey: 'id'
  })
)
const categoryOptions = computed(() =>
  toUniOptions(categoryRecords.value, {
    labelKeys: locale() === 'en' ? ['enName', 'cnName'] : ['cnName', 'enName'],
    valueKey: 'id'
  })
)

const defaultSchoolId = computed(() =>
  schoolRecords.value.length === 1 ? schoolRecords.value[0].id : null
)

const importanceOptions = computed(() => importanceLevelOpts(t))
const boolOptions = computed(() => boolTagOpts(t))
const boolFilterOptions = computed(() => boolFilterOpts(t))

const searchCfg = computed(() =>
  searchForm(
    t,
    schoolOptions.value,
    categoryOptions.value,
    importanceOptions.value,
    boolFilterOptions.value,
    defaultSchoolId.value ?? undefined
  )
)
const columns = computed(() => tableCols(t, importanceOptions.value, boolOptions.value))

const formVisible = ref(false)
const formMode = ref<'add' | 'edit'>('add')
const activeId = ref<string | number | null>(null)
const detailVisible = ref(false)
const detailId = ref<string | number | null>(null)

function formatRow(row: Row): Row {
  const next = { ...row }
  next.schoolName =
    locale() === 'en'
      ? next.schoolEnNames || next.schoolNames || '—'
      : next.schoolNames || next.schoolEnNames || '—'
  return next
}

const loadData: UniTableRequest = async ({ pageNo: current, pageSize: size, filters: f }) => {
  const result = await contentArticleApi.page.get({ current, size, ...f })
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
  detailId.value = row.id
  detailVisible.value = true
}

const removeRow = async (row: Row) => {
  try {
    await ElMessageBox.confirm(t('content.article.confirmDelete'), t('content.delete'), {
      confirmButtonText: t('content.submit'),
      cancelButtonText: t('content.cancel'),
      type: 'warning'
    })
  } catch {
    return
  }

  await contentArticleApi.delete.post({ id: row.id })
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
    code: 'article_edit',
    onClick: (row) => openForm('edit', row as Row)
  },
  {
    label: t('content.delete'),
    code: 'article_del',
    onClick: (row) => void removeRow(row as Row)
  }
])

const onReset = () => {
  reset()
  if (defaultSchoolId.value != null) {
    queryModel.schoolId = defaultSchoolId.value
  }
}

onMounted(async () => {
  const [schoolRaw, categoryRaw] = await Promise.all([
    contentCommonApi.schoolList.get(),
    contentCategoryApi.list.get()
  ])
  schoolRecords.value = normalizeArray(schoolRaw) as SchoolOptionRecord[]
  categoryRecords.value = normalizeArray(categoryRaw) as ContentCategoryRecord[]
})

watch(
  () => schoolRecords.value,
  (records) => {
    if (records.length === 1) {
      queryModel.schoolId = records[0].id
    }
    if (records.length > 0) {
      nextTick(() => tableRef.value?.refresh())
    }
  }
)

const tableEmpty = useListTableEmpty(filters, { tableRef, afterLoadSuccess: handleLoadSuccess })
</script>
