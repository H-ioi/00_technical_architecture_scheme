<template>
  <section class="uni-list-page permission-dept">
    <div class="uni-list-page__header">
      <div>
        <h1>{{ t('permission.dept.title') }}</h1>
        <p>{{ t('permission.dept.description') }}</p>
      </div>
      <div class="uni-list-page__header-actions">
        <el-button v-uni-permission="'sys_dept_add'" type="primary" @click="headerAdd">
          {{ t('permission.addDept') }}
        </el-button>
      </div>
    </div>

    <UniDataTable
      row-key="id"
      selection="single"
      :columns="columns"
      :data="treeData"
      :loading="loading"
      :pagination="false"
      :tree="deptTableTree"
      :toolbar="deptTableToolbar"
      :actions="actions"
      :action-column="{ width: 200, fixed: 'right' }"
      @refresh="loadTree"
      @selection-change="onSelectionChange">
    </UniDataTable>

    <DeptFormDialog
      v-model:visible="dialogVisible"
      :mode="dialogMode"
      :snapshot="form"
      :parent-options="parentOptions"
      :submitting="submitting"
      @save="submitFromDraft" />
  </section>
</template>

<script setup lang="ts">
import { UniDataTable } from 'uni-ui-lib'

import DeptFormDialog from './components/dept-form-dialog.vue'
import { useList } from './use-list'

const {
  actions,
  columns,
  deptTableToolbar,
  deptTableTree,
  dialogMode,
  dialogVisible,
  form,
  headerAdd,
  loadTree,
  loading,
  onSelectionChange,
  parentOptions,
  submitFromDraft,
  submitting,
  t,
  treeData
} = useList()
</script>
