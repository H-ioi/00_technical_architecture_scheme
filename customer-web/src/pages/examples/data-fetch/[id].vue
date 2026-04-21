<template>
  <section class="page mob--ex-page">
    <NuxtLink class="page__back" to="/examples/data-fetch">
      <span class="page__back-arrow" aria-hidden="true">←</span>
      返回列表
    </NuxtLink>

    <ExampleCard v-if="post" :title="post.title">
      <p class="page__body">{{ post.body }}</p>
    </ExampleCard>

    <div v-else-if="fetchError" class="page__err-box">{{ fetchError }}</div>
    <div v-else class="page__state">
      <span class="page__spinner" aria-hidden="true" />
      加载中…
    </div>
  </section>
</template>

<script setup lang="ts">
import type { ExamplePost } from '~/types/example-post'

const route = useRoute()
const id = computed(() => {
  const raw = route.params.id
  const s = Array.isArray(raw) ? raw[0] : raw
  return s ?? ''
})

const { data: post, error } = await useFetch<ExamplePost>(() => `/api/example/posts/${id.value}`, {
  watch: [id]
})

const fetchError = computed(() =>
  error.value ? (error.value.message || '请求失败') : ''
)
</script>

<style scoped lang="scss">
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.page {
  &__back {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 22px;
    padding: 8px 14px 8px 10px;
    font-size: 14px;
    font-weight: 600;
    color: $color-text-muted;
    text-decoration: none;
    background: $color-surface;
    border: 1px solid $color-border;
    border-radius: $radius-full;
    box-shadow: $shadow-sm;
    transition:
      color 0.15s ease,
      border-color 0.15s ease;

    &:hover {
      color: $color-primary-strong;
      border-color: rgba(0, 193, 106, 0.35);
    }
  }

  &__back-arrow {
    opacity: 0.8;
  }

  &__body {
    margin: 0;
    line-height: 1.75;
    white-space: pre-wrap;
    color: $color-text-muted;
  }

  &__err-box {
    padding: 14px 16px;
    font-size: 14px;
    color: #991b1b;
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: $radius-md;
  }

  &__state {
    display: flex;
    align-items: center;
    gap: 10px;
    color: $color-text-muted;
  }

  &__spinner {
    width: 18px;
    height: 18px;
    border: 2px solid $color-border;
    border-top-color: $color-primary;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }
}

@media (max-width: 768px) {
  .mob--ex-page {
    .page__back {
      gap: 8px;
      margin-bottom: 14px;
      padding: 8px 12px 8px 10px;
      font-size: 0.82rem;
    }

    .page__body {
      font-size: 0.9rem;
      line-height: 1.65;
    }

    .page__err-box {
      padding: 12px;
      font-size: 0.85rem;
    }

    .page__state {
      gap: 8px;
      font-size: 0.85rem;
    }

    .page__spinner {
      width: 16px;
      height: 16px;
    }
  }
}
</style>
