<script setup lang="ts">
const metrics = [
  { label: '待办事项', value: 12 },
  { label: '今日访问', value: 2480 },
  { label: '告警事件', value: 3 },
  { label: '上线应用', value: 8 }
]
</script>

<template>
  <section class="dashboard-page">
    <el-card shadow="never" class="dashboard-page__welcome">
      <h1>工作台</h1>
      <p>这里保留后台首页的最小样例，后续可按业务域拆分卡片、图表、待办和快捷入口。</p>
    </el-card>

    <div class="dashboard-page__metrics">
      <el-card
        v-for="item in metrics"
        :key="item.label"
        shadow="never"
        class="dashboard-page__metric"
      >
        <span>{{ item.label }}</span>
        <strong>{{ item.value }}</strong>
      </el-card>
    </div>

    <el-card shadow="never">
      <template #header>
        <div class="dashboard-page__card-title">权限指令示例</div>
      </template>
      <el-button v-permission="'system:user:create'" type="primary">新增用户</el-button>
      <el-button v-permission="'system:user:view'">查看用户</el-button>
    </el-card>
  </section>
</template>

<style scoped lang="scss">
.dashboard-page {
  display: grid;
  gap: 16px;
}

.dashboard-page__welcome {
  h1 {
    margin: 0 0 8px;
    font-size: 24px;
  }

  p {
    margin: 0;
    color: var(--app-text-color-secondary);
  }
}

.dashboard-page__metrics {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.dashboard-page__metric {
  span {
    color: var(--app-text-color-secondary);
  }

  strong {
    display: block;
    margin-top: 12px;
    color: var(--app-text-color);
    font-size: 28px;
  }
}

.dashboard-page__card-title {
  font-weight: 700;
}

@media (width <= 960px) {
  .dashboard-page__metrics {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
