<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { Recordable } from 'uni-ui-lib'

import { createCustomerEditConfig, getCustomerById } from './shared'

const route = useRoute()
const router = useRouter()

const source = getCustomerById(String(route.params.id))
const formModel = ref<Recordable>(source ? { ...source } : {})
const editConfig = createCustomerEditConfig()

const submit = (value: Recordable) => {
  ElMessage.success(`已保存 ${String(value.name ?? '客户')}`)
  router.back()
}
</script>

<template>
  <section class="demo-page">
    <el-card shadow="never">
      <template #header>
        <div class="demo-page__header">
          <div>
            <h1>客户编辑</h1>
            <p>从表格页跳转进入，使用 UniForm 编辑态承载完整编辑流程。</p>
          </div>
          <el-button @click="router.back()">返回</el-button>
        </div>
      </template>

      <UniForm v-if="source" v-model="formModel" :config="editConfig" mode="edit" @submit="submit">
        <template #actions="{ submit: submitForm, reset }">
          <el-button type="primary" @click="submitForm">保存</el-button>
          <el-button @click="reset">重置</el-button>
          <el-button @click="router.back()">取消</el-button>
        </template>
      </UniForm>
      <el-empty v-else description="未找到客户数据" />
    </el-card>
  </section>
</template>

<style scoped lang="scss">
.demo-page {
  display: grid;
  gap: 16px;
}

.demo-page__header {
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: space-between;

  h1 {
    margin: 0 0 8px;
    font-size: 20px;
  }

  p {
    margin: 0;
    color: var(--app-text-color-secondary);
  }
}
</style>
