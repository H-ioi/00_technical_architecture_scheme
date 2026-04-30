<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { createCustomerDetailConfig, getCustomerById } from './shared'

const route = useRoute()
const router = useRouter()

const detail = computed(() => getCustomerById(String(route.params.id)))
const detailConfig = createCustomerDetailConfig()
</script>

<template>
  <section class="demo-page">
    <el-card shadow="never">
      <template #header>
        <div class="demo-page__header">
          <div>
            <h1>客户详情</h1>
            <p>从表格页跳转进入，使用 UniForm 的查看态承载详情信息。</p>
          </div>
          <el-button @click="router.back()">返回</el-button>
        </div>
      </template>

      <UniForm v-if="detail" :model-value="detail" :config="detailConfig" mode="view" />
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
