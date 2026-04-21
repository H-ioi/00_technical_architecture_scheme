<template>
  <section class="page">
    <header class="page__intro">
      <p class="ex-eyebrow">Mock API</p>
      <h1 class="ex-h1">模拟服务 · 数据请求</h1>
      <p class="ex-lead">
        列表：<span class="ex-code">GET /api/example/posts</span>；详情：
        <span class="ex-code">GET /api/example/posts/:id</span>。数据源：
        <span class="ex-code">src/server/utils/mock-posts.ts</span>（仅供案例）。
      </p>
    </header>

    <ExampleCard title="列表 · useExamplePosts">
      <div v-if="pending" class="page__state">
        <span class="page__spinner" aria-hidden="true" />
        加载中…
      </div>
      <p v-else-if="error" class="page__err">{{ errorText }}</p>
      <ul v-else class="page__rows">
        <li v-for="item in listData?.items ?? []" :key="item.id" class="page__row">
          <NuxtLink :to="`/examples/data-fetch/${item.id}`" class="page__row-link">
            {{ item.title }}
          </NuxtLink>
          <span class="page__row-meta">{{ item.excerpt }}</span>
        </li>
      </ul>
      <p class="page__meta">共 {{ listData?.total ?? 0 }} 条 · 下方演示 <span class="ex-code">limit=2</span></p>
    </ExampleCard>

    <ExampleCard title="查询参数 · limit=2">
      <ul v-if="limited?.items" class="page__chips">
        <li v-for="item in limited.items" :key="item.id" class="page__chip">{{ item.title }}</li>
      </ul>
    </ExampleCard>
  </section>
</template>

<script setup lang="ts">
function errorToText (e: unknown): string {
  if (e == null) {
    return ''
  }
  if (e instanceof Error) {
    return e.message
  }
  return String(e)
}

const { data: listData, pending, error } = await useExamplePosts()

const { data: limited } = await useExamplePosts({ limit: 2 })

const errorText = computed(() => errorToText(error.value))
</script>

<style scoped lang="scss">
.page__intro {
  margin-bottom: 28px;
}

.page__state {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9375rem;
  color: $color-text-muted;
}

.page__spinner {
  width: 18px;
  height: 18px;
  border: 2px solid $color-border;
  border-top-color: $color-primary;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.page__err {
  margin: 0;
  padding: 10px 12px;
  font-size: 0.875rem;
  color: #991b1b;
  background: #fef2f2;
  border-radius: $radius-sm;
  border: 1px solid #fecaca;
}

.page__rows {
  margin: 0;
  padding: 0;
  list-style: none;
}

.page__row {
  padding: 12px 0;
  border-bottom: 1px solid $color-border;

  &:last-child {
    border-bottom: none;
  }
}

.page__row-link {
  display: inline-block;
  font-weight: 700;
  font-size: 0.9375rem;
  color: $color-text;
  text-decoration: none;

  &:hover {
    color: $color-primary-strong;
  }
}

.page__row-meta {
  display: block;
  margin-top: 6px;
  font-size: 0.8125rem;
  color: $color-text-muted;
  line-height: 1.45;
}

.page__meta {
  margin: 14px 0 0;
  padding-top: 12px;
  border-top: 1px dashed $color-border;
  font-size: 0.8125rem;
  color: $color-text-subtle;
}

.page__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.page__chip {
  padding: 8px 12px;
  font-size: 0.8125rem;
  font-weight: 500;
  color: #4338ca;
  background: #eef2ff;
  border-radius: $radius-full;
  border: 1px solid rgba(99, 102, 241, 0.2);
}
</style>
