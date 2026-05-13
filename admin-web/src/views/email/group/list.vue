<template>
  <section class="uni-list-page">
    <div class="uni-list-page__header">
      <div>
        <h1>{{ $t('email.group.pageTitle') }}</h1>
        <p class="uni-list-page__description">{{ $t('email.group.pageDesc') }}</p>
      </div>
      <div v-if="hasPermission('mailgroup-add')" class="uni-list-page__header-actions">
        <el-button type="primary" @click="openAdd">{{ $t('email.add') }}</el-button>
      </div>
    </div>

    <UniSearchForm
      v-model="queryModel"
      :config="searchCfg"
      :collapsed="true"
      :collapsed-rows="1"
      :action-min-span="0"
      :submit-text="$t('member.actions.search')"
      :reset-text="$t('member.actions.reset')"
      @search="search"
      @reset="reset" />

    <UniDataTable
      ref="tableRef"
      row-key="id"
      selection="multiple"
      :columns="columns"
      :request="loadData"
      :filters="filters"
      :pagination="{ pageSize: 10, pageSizes: [10, 20, 50, 100] }"
      :toolbar="{ refresh: true, density: true, columnSetting: true }"
      :actions="actions"
      :action-column="{ width: 115, fixed: 'right' }"
      @load-success="handleLoadSuccess"
      @selection-change="onSelectionChange">
      <template #toolbar>
        <el-button
          v-if="hasPermission('mailgroup-gd')"
          :disabled="batchDisabled"
          @click="batchStatus(0)">
          {{ $t('email.archive') }}
        </el-button>
        <el-button
          v-if="hasPermission('mailgroup-sy')"
          :disabled="batchDisabled"
          @click="batchStatus(1)">
          {{ $t('email.markActive') }}
        </el-button>
        <el-button
          v-if="hasPermission('mailgroup-delete')"
          type="danger"
          :disabled="batchDisabled"
          @click="batchStatus(-1)">
          {{ $t('email.deleteBatch') }}
        </el-button>
      </template>
    </UniDataTable>

    <GroupDialog
      ref="dialogRef"
      v-model="dialogVisible"
      :mode="dialogMode"
      @success="tableRef?.refresh()" />

    <el-dialog v-model="viewVisible" :title="$t('email.view')" width="560px" destroy-on-close>
      <div class="email-grp-view">
        <p>
          <strong>{{ $t('email.group.colName') }}：</strong>{{ viewMeta.name }}
        </p>
        <p>
          <strong>{{ $t('email.group.colParentMail') }}：</strong>{{ viewMeta.parent }}
        </p>
        <p>
          <strong>{{ $t('email.group.colStudentMail') }}：</strong>{{ viewMeta.student }}
        </p>
        <p>
          <strong>{{ $t('email.status') }}：</strong>{{ viewMeta.status }}
        </p>
        <p>
          <strong>{{ $t('email.createdAt') }}：</strong>{{ viewMeta.createdAt }}
        </p>
        <p>
          <strong>{{ $t('email.group.colScopes') }}：</strong>
        </p>
        <ul v-if="viewLabels.length" class="email-grp-view__scopes">
          <li v-for="(line, i) in viewLabels" :key="i">{{ line }}</li>
        </ul>
        <p v-else>—</p>
      </div>
      <template #footer>
        <el-button @click="viewVisible = false">{{ $t('common.close') }}</el-button>
      </template>
    </el-dialog>
  </section>
</template>

<script setup lang="ts">
import { nextTick, ref } from 'vue'

import { UniDataTable, UniSearchForm } from 'uni-ui-lib'

import GroupDialog from './components/group-dialog.vue'
import { useList } from './use-list'

const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const dialogRef = ref<InstanceType<typeof GroupDialog> | null>(null)

const {
  actions,
  batchDisabled,
  batchStatus,
  columns,
  filters,
  handleLoadSuccess,
  hasPermission,
  loadData,
  onSelectionChange,
  queryModel,
  reset,
  search,
  searchCfg,
  tableRef,
  viewLabels,
  viewMeta,
  viewVisible
} = useList({
  onEditRow: (row) => {
    dialogMode.value = 'edit'
    dialogVisible.value = true
    void nextTick(() => dialogRef.value?.openEdit(row))
  }
})

const openAdd = () => {
  dialogMode.value = 'add'
  dialogVisible.value = true
  void nextTick(() => dialogRef.value?.openAdd())
}
</script>

<style scoped lang="scss">
.email-grp-view {
  font-size: 14px;
  line-height: 1.6;

  &__scopes {
    margin: 0;
    padding-left: 20px;
  }
}
</style>
