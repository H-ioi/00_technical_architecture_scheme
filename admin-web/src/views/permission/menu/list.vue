<template>
  <section class="uni-list-page permission-menu">
    <div class="uni-list-page__header">
      <div>
        <h1>{{ t('permission.menu.title') }}</h1>
        <p>{{ t('permission.menu.description') }}</p>
      </div>
    </div>

    <UniDataTable
      row-key="id"
      :columns="columns"
      :data="menuList"
      :loading="loading"
      :pagination="false"
      :tree="menuTableTree"
      :toolbar="menuTableToolbar"
      :actions="actions"
      :action-column="menuActionColumn"
      @refresh="loadTree"
    >
      <template #column-icon="{ row }">
        <MenuIconDisplay :name="row.icon" />
      </template>
      <template #column-type="{ row }">
        <el-tag v-if="row.type === '0'" type="success">{{ t('permission.menu.type.left') }}</el-tag>
        <el-tag v-else-if="row.type === '2'" type="success">{{ t('permission.menu.type.top') }}</el-tag>
        <el-tag v-else-if="row.type === '1'" type="info">{{ t('permission.menu.type.button') }}</el-tag>
        <span v-else>{{ t('permission.menu.type.unknown') }}</span>
      </template>
      <template #column-keepAlive="{ row }">
        <el-tag v-if="row.keepAlive === '1'" type="success">{{ t('permission.menu.cacheOn') }}</el-tag>
        <el-tag v-else type="info">{{ t('permission.menu.cacheOff') }}</el-tag>
      </template>
    </UniDataTable>

    <EditDialog
      v-model:visible="dialogVisible"
      :snapshot="form"
      :parent-options="parentOptions"
      :submitting="submitting"
      @save="submitFromDraft"
    />
  </section>
</template>

<script setup lang="ts">
import { UniDataTable } from 'uni-ui-lib'

import { MenuIconDisplay } from '@/components/menu-sidebar-icon'

import EditDialog from './components/edit-dialog.vue'
import { useList } from './use-list'

const {
  actions,
  columns,
  dialogVisible,
  form,
  loading,
  menuActionColumn,
  menuList,
  menuTableToolbar,
  menuTableTree,
  parentOptions,
  submitFromDraft,
  submitting,
  t,
  loadTree
} = useList()
</script>
