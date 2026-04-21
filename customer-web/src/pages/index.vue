<template>
  <section class="home mob--ex-home">
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
.home {
  &__hero {
    margin-bottom: 28px;
  }

  &__cards {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
    margin-bottom: 28px;
  }

  &__card {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 18px 16px;
    text-decoration: none;
    color: inherit;
    background: rgba(255, 255, 255, 0.86);
    border: 1px solid $color-border;
    border-radius: $radius-lg;
    box-shadow: $shadow-sm;
    transition:
      transform 0.2s ease,
      box-shadow 0.2s ease,
      border-color 0.2s ease;

    &:hover {
      transform: translateY(-2px);
      border-color: rgba(59, 130, 246, 0.35);
      box-shadow: $shadow-md;
    }
  }

  &__card-icon {
    font-size: 1.15rem;
    color: $color-primary-strong;

    &--api {
      color: #0ea5e9;
    }

    &--layout {
      color: $color-accent;
    }
  }

  &__card-title {
    font-size: 1rem;
    font-weight: 700;
    letter-spacing: -0.01em;
  }

  &__card-desc {
    font-size: 0.82rem;
    line-height: 1.55;
    color: $color-text-muted;
  }

  &__panels {
    display: grid;
    grid-template-columns: 1.25fr 1fr;
    gap: 16px;
  }

  &__panel {
    padding: 16px;
    background: rgba(255, 255, 255, 0.9);
    border: 1px solid $color-border;
    border-radius: $radius-lg;
    box-shadow: $shadow-sm;
  }

  &__panel-title {
    margin: 0 0 10px;
    font-size: 0.73rem;
    letter-spacing: 0.08em;
    font-weight: 700;
    text-transform: uppercase;
    color: $color-text-subtle;
  }

  &__pre {
    margin: 0;
    max-height: 250px;
  }

  &__panel-value {
    margin: 0 0 10px;
  }

  &__panel-foot {
    margin: 0;
    font-size: 0.82rem;
    line-height: 1.6;
    color: $color-text-muted;
  }

  &__foot {
    margin-top: 30px;
    padding-top: 18px;
    border-top: 1px dashed $color-border;
  }

  &__foot-label {
    display: block;
    margin-bottom: 8px;
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: $color-text-subtle;
  }

  &__foot-text {
    margin: 0;
    font-size: 0.9rem;
    line-height: 1.7;
    color: $color-text-muted;
  }
}

@media (width <= 1024px) {
  .home {
    &__cards {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    &__panels {
      grid-template-columns: 1fr;
    }
  }
}

@media (width <= 768px) {
  .mob--ex-home {
    .home__hero {
      margin-bottom: 20px;
    }

    .home__cards {
      grid-template-columns: 1fr;
      gap: 12px;
      margin-bottom: 20px;
    }

    .home__card {
      padding: 14px 12px;
      border-radius: $radius-md;
    }

    .home__card-title {
      font-size: 0.95rem;
    }

    .home__card-desc {
      font-size: 0.82rem;
    }

    .home__panels {
      gap: 12px;
    }

    .home__panel {
      padding: 13px 12px;
      border-radius: $radius-md;
    }

    .home__foot {
      margin-top: 20px;
      padding-top: 14px;
    }

    .home__foot-text {
      font-size: 0.85rem;
    }
  }
}
</style>
