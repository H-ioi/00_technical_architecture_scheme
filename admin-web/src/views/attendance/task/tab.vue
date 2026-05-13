<template>
  <section class="uni-list-page">
    <div class="uni-list-page__header">
      <div>
        <h1>{{ $t('attendance.holidayTask.page.title') }}</h1>
        <p>{{ $t('attendance.holidayTask.page.description') }}</p>
      </div>
    </div>
    <el-tabs v-model="active">
      <el-tab-pane :label="$t('attendance.holidayTask.tabs.todo')" name="todo">
        <TodoPanel />
      </el-tab-pane>
      <el-tab-pane :label="$t('attendance.holidayTask.tabs.done')" name="done">
        <HistoryPanel variant="done" />
      </el-tab-pane>
      <el-tab-pane :label="$t('attendance.holidayTask.tabs.instance')" name="instance">
        <HistoryPanel variant="instance" />
      </el-tab-pane>
    </el-tabs>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import HistoryPanel from './history-panel.vue'
import TodoPanel from './todo-panel.vue'

const active = ref<'todo' | 'done' | 'instance'>('todo')
</script>
