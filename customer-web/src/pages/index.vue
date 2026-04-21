<template>
  <section class="home">
    <header class="home__hero">
      <p class="ex-eyebrow">Nuxt 3 · 学习与脚手架</p>
      <h1 class="ex-h1">开箱即用的案例模版</h1>
      <p class="ex-lead">
        演示页面路由、布局切换、Nitro 接口、<span class="ex-code">runtimeConfig</span> 与路由级缓存策略，便于复制到自己的项目。
      </p>
    </header>

    <div class="home__cards">
      <NuxtLink to="/examples/components" class="home__card">
        <span class="home__card-icon" aria-hidden="true">◇</span>
        <span class="home__card-title">组件</span>
        <span class="home__card-desc">自动导入、插槽与父子通信</span>
      </NuxtLink>
      <NuxtLink to="/examples/data-fetch" class="home__card">
        <span class="home__card-icon home__card-icon--api" aria-hidden="true">◎</span>
        <span class="home__card-title">模拟接口</span>
        <span class="home__card-desc">列表、详情与 composable 封装</span>
      </NuxtLink>
      <NuxtLink to="/examples/layout-alt" class="home__card">
        <span class="home__card-icon home__card-icon--layout" aria-hidden="true">▣</span>
        <span class="home__card-title">备选布局</span>
        <span class="home__card-desc">definePageMeta 切换壳子</span>
      </NuxtLink>
    </div>

    <div class="home__panels">
      <article class="home__panel">
        <h2 class="home__panel-title">接口示例 · GET /api/example/posts</h2>
        <pre class="ex-pre home__pre">{{ postsPreviewPretty }}</pre>
      </article>
      <article class="home__panel">
        <h2 class="home__panel-title">运行时 · public.siteUrl</h2>
        <p class="home__panel-value">
          <span class="ex-code">{{ siteUrl }}</span>
        </p>
        <p class="home__panel-foot">在 <span class="ex-code">.env</span> 中设置 <span class="ex-code">NUXT_PUBLIC_SITE_URL</span> 覆盖。</p>
      </article>
    </div>

    <footer class="home__foot">
      <span class="home__foot-label">源码路径</span>
      <p class="home__foot-text">
        页面 <span class="ex-code">src/pages/</span> · 接口案例 <span class="ex-code">src/server/api/example/</span> · 示例数据
        <span class="ex-code">src/server/utils/mock-posts.ts</span>
      </p>
    </footer>
  </section>
</template>

<script setup lang="ts">
import type { ExamplePostsListPayload } from '~/types/example-post'

const runtime = useRuntimeConfig()

const siteUrl = computed(() => runtime.public.siteUrl)

const { data: postsPreview } = await useFetch<ExamplePostsListPayload>('/api/example/posts')

const postsPreviewPretty = computed(() =>
  postsPreview.value ? JSON.stringify(postsPreview.value, null, 2) : ''
)
</script>

<style scoped lang="scss">
.home__hero {
  margin-bottom: 32px;
}

.home__cards {
  display: grid;
  gap: 14px;
  margin-bottom: 36px;

  @media (min-width: 640px) {
    grid-template-columns: repeat(3, 1fr);
  }
}

.home__card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 20px 18px;
  text-decoration: none;
  color: inherit;
  background: $color-surface;
  border: 1px solid $color-border;
  border-radius: $radius-lg;
  box-shadow: $shadow-sm;
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    border-color 0.18s ease;

  &:hover {
    transform: translateY(-3px);
    border-color: rgba(0, 193, 106, 0.35);
    box-shadow: $shadow-md;
  }
}

.home__card-icon {
  font-size: 1.25rem;
  line-height: 1;
  color: $color-primary-strong;

  &--api {
    color: #6366f1;
  }

  &--layout {
    color: #c026d3;
  }
}

.home__card-title {
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.home__card-desc {
  font-size: 0.8125rem;
  color: $color-text-muted;
  line-height: 1.45;
}

.home__panels {
  display: grid;
  gap: 18px;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
}

.home__panel {
  padding: 20px 20px 22px;
  background: $color-surface;
  border: 1px solid $color-border;
  border-radius: $radius-lg;
  box-shadow: $shadow-sm;
}

.home__panel-title {
  margin: 0 0 12px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: $color-text-subtle;
}

.home__pre {
  margin: 0;
  max-height: 220px;
}

.home__panel-value {
  margin: 0 0 10px;
}

.home__panel-foot {
  margin: 0;
  font-size: 0.8125rem;
  color: $color-text-muted;
  line-height: 1.55;
}

.home__foot {
  margin-top: 40px;
  padding-top: 24px;
  border-top: 1px dashed $color-border;
}

.home__foot-label {
  display: block;
  margin-bottom: 8px;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: $color-text-subtle;
}

.home__foot-text {
  margin: 0;
  font-size: 0.875rem;
  color: $color-text-muted;
  line-height: 1.65;
}
</style>
