<template>
  <section class="uni-list-page base-dict-page">
    <div class="uni-list-page__header">
      <div>
        <h1>{{ mt('page.title') }}</h1>
        <p>{{ mt('page.description') }}</p>
      </div>
      <el-button type="primary" @click="openAdd">{{ mt('actions.add') }}</el-button>
    </div>

    <UniSearchForm
      v-model="queryModel"
      :config="searchConfig"
      :collapsed="true"
      :collapsed-rows="1"
      :action-min-span="0"
      :submit-text="mt('actions.search')"
      :reset-text="mt('actions.reset')"
      @search="search"
      @reset="reset" />

    <UniDataTable
      ref="tableRef"
      row-key="id"
      :columns="columns"
      :request="tableRequest"
      :filters="filters"
      :pagination="false"
      :toolbar="{ refresh: true, density: true, columnSetting: true }"
      :actions="actions"
      :action-column="{ width: 180, fixed: 'right' }"
      @load-success="handleLoadSuccess"
      @request-error="onTableRequestError"
      @switch-change="onStatusSwitch" />

    <el-dialog
      v-model="formVisible"
      destroy-on-close
      :title="formMode === 'edit' ? mt('dialog.formEdit') : mt('dialog.formAdd')"
      width="480px">
      <UniForm v-model="ruleForm" mode="edit" :config="formConfig" />
      <template #footer>
        <el-button @click="formVisible = false">{{ mt('actions.cancel') }}</el-button>
        <el-button type="primary" @click="submitForm">{{ mt('actions.save') }}</el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="deleteVisible"
      destroy-on-close
      :title="mt('dialog.deleteTitle')"
      width="480px">
      <p>{{ mt('dialog.deleteConfirm') }}</p>
      <template #footer>
        <el-button @click="deleteVisible = false">{{ mt('actions.cancel') }}</el-button>
        <el-button type="primary" @click="confirmDelete">{{ mt('actions.confirm') }}</el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="attrsVisible"
      destroy-on-close
      :title="mt('dialog.attrsTitle')"
      width="640px">
      <UniDataTable
        v-if="attrsVisible"
        row-key="_rk"
        :columns="attrColumns"
        :data="attrRows"
        :pagination="false"
        :toolbar="false"
        :action-column="{ label: mt('actions.operations'), width: 100, fixed: 'right' }">
        <template #column-dictItemValue="{ row }">
          <span v-if="!row.isedit">{{ row.dictItemValue }}</span>
          <el-input v-else v-model="row.dictItemValue" :placeholder="mt('placeholder.attrValue')" />
        </template>
        <template #actions="{ row, index }">
          <el-button link type="primary" @click="toggleAttrEdit(row, index)">
            {{ row.isedit ? mt('actions.attrSave') : mt('actions.attrEdit') }}
          </el-button>
        </template>
      </UniDataTable>
    </el-dialog>
  </section>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import type { Recordable, UniTableColumn, UniTableRequest } from 'uni-ui-lib'
import { UniDataTable, UniForm, UniSearchForm, useUniI18n, useUniListState } from 'uni-ui-lib'
import { computed, ref } from 'vue'

import { baseDictApi } from '@/api'
import type { BaseDictFieldRecord, BaseDictItemRecord } from '@/types/modules/base-dict'

import {
  dictAttrColumns,
  dictItemActions,
  dictItemColumns,
  dictItemFormConfig,
  dictSearchForm
} from './dict.config'

/**
 * ElSwitch 用 `===` 比较 modelValue 与 activeValue/inactiveValue；后端若为 1/0 等与 true/false
 * 不等价会在挂载时触发 CHANGE（Element Plus switch.vue setup 内纠错逻辑），导致批量请求。
 */
function normalizeRowStatus(item: BaseDictItemRecord): BaseDictItemRecord {
  const v = item.status

  let status: boolean
  if (v === true || v === false) {
    status = v
  } else if (typeof v === 'number') {
    status = v !== 0
  } else if (typeof v === 'string') {
    const s = v.trim().toLowerCase()
    status = s === '1' || s === 'true'
  } else {
    status = Boolean(v)
  }

  return { ...item, status }
}

function parseSortField(raw: BaseDictItemRecord['sort']): number | undefined {
  if (raw === '' || raw === null || raw === undefined) {
    return undefined
  }

  const n = typeof raw === 'number' ? raw : Number.parseInt(String(raw).trim(), 10)

  return Number.isFinite(n) ? n : undefined
}

function sortPayload(sort: number | undefined): string | number | '' {
  return sort === undefined ? '' : sort
}

type AttrRow = BaseDictFieldRecord & { _rk: string; isedit?: boolean }

const props = defineProps<{
  dictType: string
  localeScope: 'school' | 'grade'
}>()

const { t } = useUniI18n()

const mt = (key: string) => t(`base.${props.localeScope}.${key}`)

const { queryModel, filters, tableRef, search, reset, handleLoadSuccess } = useUniListState({
  initialFilters: { keyword: '' }
})

const formVisible = ref(false)
const formMode = ref<'add' | 'edit'>('add')
const deleteVisible = ref(false)
const attrsVisible = ref(false)
const attrRows = ref<AttrRow[]>([])
const currentEditId = ref<string | number | ''>('')
const pendingDeleteId = ref<string | number | ''>('')
const currentAttrItemId = ref<string | number | ''>('')
const currentAttrLabel = ref('')

const ruleForm = ref<{ label: string; sort: number | undefined }>({
  label: '',
  sort: undefined
})

const columns = computed(() => dictItemColumns(mt))
const attrColumns = computed(() => dictAttrColumns(mt))
const formConfig = computed(() => dictItemFormConfig(mt))
const searchConfig = computed(() => dictSearchForm(mt))

const reloadTable = () => {
  tableRef.value?.refresh()
}

const onTableRequestError = () => {
  ElMessage.error(mt('messages.loadFail'))
}

const tableRequest: UniTableRequest<BaseDictItemRecord> = async ({ filters: reqFilters }) => {
  const list = await baseDictApi.list.get(props.dictType)
  let filtered = list.filter((item) => !item.archived).map(normalizeRowStatus)
  const kw = String(reqFilters?.keyword ?? '')
    .trim()
    .toLowerCase()

  if (kw) {
    filtered = filtered.filter((item) =>
      String(item.label ?? '')
        .toLowerCase()
        .includes(kw)
    )
  }

  return {
    data: filtered,
    total: filtered.length
  }
}

const openAdd = () => {
  formMode.value = 'add'
  currentEditId.value = ''
  ruleForm.value = { label: '', sort: undefined }
  formVisible.value = true
}

const openEdit = (row: BaseDictItemRecord) => {
  formMode.value = 'edit'
  currentEditId.value = row.id
  ruleForm.value = { label: row.label, sort: parseSortField(row.sort) }
  formVisible.value = true
}

const submitForm = async () => {
  try {
    const payload = ruleForm.value

    if (formMode.value === 'edit' && currentEditId.value !== '') {
      await baseDictApi.edit.put({
        id: currentEditId.value,
        label: payload.label,
        sort: sortPayload(payload.sort)
      })
      ElMessage.success(mt('messages.updateOk'))
    } else {
      await baseDictApi.add.post({
        label: payload.label,
        sort: sortPayload(payload.sort),
        type: props.dictType
      })
      ElMessage.success(mt('messages.addOk'))
    }
    formVisible.value = false
    reloadTable()
  } catch {
    ElMessage.error(mt('messages.saveFail'))
  }
}

const onStatusSwitch = async (row: Recordable, column: UniTableColumn, value: unknown) => {
  if (column.prop !== 'status') {
    return
  }

  const item = row as BaseDictItemRecord
  const next = Boolean(value)
  const prev = item.status === true

  try {
    if (next) {
      await baseDictApi.enable.put(item.id)
      ElMessage.success(mt('messages.enabledOk'))
    } else {
      await baseDictApi.disable.put(item.id)
      ElMessage.success(mt('messages.disabledOk'))
    }
    item.status = next
  } catch {
    item.status = prev
    ElMessage.error(mt('messages.saveFail'))
  }
}

const openDelete = (row: BaseDictItemRecord) => {
  pendingDeleteId.value = row.id
  deleteVisible.value = true
}

const confirmDelete = async () => {
  if (pendingDeleteId.value === '') {
    return
  }

  try {
    await baseDictApi.remove.delete(pendingDeleteId.value)
    ElMessage.success(mt('messages.deleteOk'))
    deleteVisible.value = false
    pendingDeleteId.value = ''
    reloadTable()
  } catch {
    ElMessage.error(mt('messages.saveFail'))
  }
}

const refreshAttrs = async () => {
  const id = currentAttrItemId.value
  if (id === '') {
    return
  }

  try {
    const data = await baseDictApi.fields.get(id)

    if (data.length > 0) {
      attrRows.value = data.map((item, i) => ({
        ...item,
        isedit: false,
        _rk: `rk-${i}-${item.dictItemType}`
      }))
    } else {
      attrRows.value = [
        {
          dictItemLabel: currentAttrLabel.value,
          dictItemType: 'en_US',
          dictItemValue: '',
          isedit: false,
          _rk: 'rk-0'
        }
      ]
    }
  } catch {
    ElMessage.error(mt('messages.loadFail'))
  }
}

const openAttrs = async (row: BaseDictItemRecord) => {
  currentAttrItemId.value = row.id
  currentAttrLabel.value = row.label
  await refreshAttrs()
  attrsVisible.value = true
}

const toggleAttrEdit = async (row: AttrRow, index: number) => {
  if (!row.isedit) {
    attrRows.value[index] = { ...row, isedit: true }
    return
  }

  try {
    await baseDictApi.fieldSave.post({
      dictItemId: currentAttrItemId.value,
      type: row.dictItemType,
      value: row.dictItemValue
    })
    ElMessage.success(mt('messages.fieldOk'))
    await refreshAttrs()
  } catch {
    ElMessage.error(mt('messages.saveFail'))
  }
}

const actions = computed(() =>
  dictItemActions(mt, {
    onEdit: openEdit,
    onAttrs: openAttrs,
    onDelete: openDelete
  })
)
</script>

<style scoped lang="scss">
.base-dict-page :deep(.uni-data-table .el-table__fixed-right .el-button.is-link) {
  padding: 0 4px;
  margin: 0;
}
</style>
