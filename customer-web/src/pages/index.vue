<template>
  <section :class="['home', 'mob--ex-home', `home--${theme}`]">
    <header class="home__hero">
      <div class="home__hero-copy">
        <p class="ex-eyebrow">Nuxt 3 Website Starter</p>
        <h1 class="ex-h1">企业官网级案例模板，开箱即用</h1>
        <p class="ex-lead">
          基于 Nuxt 3 + TypeScript + Sass，内置 SSR、接口示例、布局切换与工程规范。适合官网、内容门户、营销活动站快速落地。
        </p>
        <div class="home__hero-actions">
          <NuxtLink class="home__btn home__btn--primary" to="/examples/components">查看组件案例</NuxtLink>
          <NuxtLink class="home__btn" to="/examples/data-fetch">查看接口案例</NuxtLink>
        </div>
        <div class="home__metrics">
          <div class="home__metric">
            <span class="home__metric-num">3+</span>
            <span class="home__metric-label">页面案例</span>
          </div>
          <div class="home__metric">
            <span class="home__metric-num">SSR</span>
            <span class="home__metric-label">默认渲染</span>
          </div>
          <div class="home__metric">
            <span class="home__metric-num">60s</span>
            <span class="home__metric-label">API SWR 缓存</span>
          </div>
        </div>
      </div>
      <aside class="home__hero-panel">
        <h2 class="home__panel-title">运行配置</h2>
        <p class="home__panel-foot">当前站点地址（runtimeConfig.public.siteUrl）</p>
        <p class="home__site-url">{{ siteUrl }}</p>
        <pre class="ex-pre home__pre">{{ postsPreviewPretty }}</pre>
      </aside>
    </header>

    <section class="home__section">
      <header class="home__section-head">
        <h2>核心能力</h2>
        <p>覆盖官网搭建最常见的页面组织、数据拉取与布局扩展场景。</p>
      </header>
      <div class="home__cards">
        <NuxtLink to="/examples/components" class="home__card">
          <span class="home__card-icon" aria-hidden="true">◇</span>
          <span class="home__card-title">组件体系</span>
          <span class="home__card-desc">示例卡片、计数器、插槽和父子通信模式。</span>
        </NuxtLink>
        <NuxtLink to="/examples/data-fetch" class="home__card">
          <span class="home__card-icon home__card-icon--api" aria-hidden="true">◎</span>
          <span class="home__card-title">数据请求</span>
          <span class="home__card-desc">useFetch + composable + Nitro API 的标准链路。</span>
        </NuxtLink>
        <NuxtLink to="/examples/layout-alt" class="home__card">
          <span class="home__card-icon home__card-icon--layout" aria-hidden="true">▣</span>
          <span class="home__card-title">多布局</span>
          <span class="home__card-desc">同站点支持默认壳与营销壳，页面按需切换。</span>
        </NuxtLink>
      </div>
    </section>

    <footer class="home__foot">
      <span class="home__foot-label">源码路径</span>
      <p class="home__foot-text">
        页面 <span class="ex-code">src/pages/</span> · 接口 <span class="ex-code">src/server/api/example/</span> · 数据
        <span class="ex-code">src/server/utils/mock-posts.ts</span>
      </p>
    </footer>
  </section>
</template>

<script setup lang="ts">
import type { ExamplePostsListPayload } from '~/types/example-post'

const runtime = useRuntimeConfig()
const theme = useState<'brand' | 'campaign'>('site-theme', () => 'brand')

const siteUrl = computed(() => runtime.public.siteUrl)

const { data: postsPreview } = await useFetch<ExamplePostsListPayload>('/api/example/posts')

const postsPreviewPretty = computed(() =>
  postsPreview.value ? JSON.stringify(postsPreview.value, null, 2) : ''
)
</script>

<style scoped lang="scss">
.home {
  &__hero {
    display: grid;
    grid-template-columns: 1.2fr 0.8fr;
    gap: 18px;
    margin-bottom: 26px;
    align-items: stretch;
  }

  &__hero-copy {
    padding: 26px 24px;
    border-radius: $radius-lg;
    border: 1px solid $color-border;
    background: linear-gradient(165deg, rgba(255, 255, 255, 0.94) 0%, rgba(239, 246, 255, 0.9) 100%);
    box-shadow: $shadow-md;
  }

  &__hero-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 18px;
  }

  &__btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 10px 14px;
    border-radius: $radius-full;
    border: 1px solid $color-border;
    text-decoration: none;
    color: $color-text;
    font-weight: 600;
    font-size: 0.82rem;
    background: rgba(255, 255, 255, 0.92);

    &--primary {
      color: #fff;
      border-color: transparent;
      background: linear-gradient(135deg, $color-primary 0%, $color-accent 100%);
    }
  }

  &__metrics {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 10px;
  }

  &__metric {
    padding: 10px;
    border-radius: $radius-md;
    background: rgba(255, 255, 255, 0.74);
    border: 1px solid $color-border;
  }

  &__metric-num {
    display: block;
    margin-bottom: 4px;
    font-weight: 700;
    font-size: 1rem;
    color: $color-primary-strong;
  }

  &__metric-label {
    display: block;
    font-size: 0.76rem;
    color: $color-text-muted;
  }

  &__hero-panel {
    padding: 18px 16px;
    border-radius: $radius-lg;
    border: 1px solid $color-border;
    background: rgba(255, 255, 255, 0.92);
    box-shadow: $shadow-sm;
  }

  &__site-url {
    margin: 0 0 10px;
    padding: 8px 10px;
    border-radius: $radius-md;
    background: $color-surface-soft;
    border: 1px solid $color-border;
    color: $color-primary-strong;
    font-weight: 600;
    font-size: 0.82rem;
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
    padding: 18px 16px;
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
    max-height: 260px;
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

  &__section {
    margin-top: 4px;
  }

  &__section-head {
    margin-bottom: 14px;

    h2 {
      margin: 0 0 6px;
      font-size: 1.05rem;
      letter-spacing: -0.01em;
    }

    p {
      margin: 0;
      font-size: 0.84rem;
      color: $color-text-muted;
      line-height: 1.65;
    }
  }
}

.home--campaign {
  .home__hero-copy {
    background: linear-gradient(165deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 237, 213, 0.88) 100%);
  }

  .home__btn--primary {
    background: linear-gradient(135deg, #f97316 0%, #ec4899 100%);
  }

  .home__metric-num {
    color: #be185d;
  }

  .home__site-url {
    color: #be185d;
    background: rgba(255, 237, 213, 0.7);
  }

  .home__card {
    border-color: rgba(236, 72, 153, 0.22);
    background: linear-gradient(165deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 241, 242, 0.85) 100%);

    &:hover {
      border-color: rgba(236, 72, 153, 0.38);
    }
  }

  .home__card-icon {
    color: #be185d;

    &--api {
      color: #ea580c;
    }

    &--layout {
      color: #db2777;
    }
  }

  .home__panel {
    border-color: rgba(236, 72, 153, 0.2);
    background: linear-gradient(165deg, rgba(255, 255, 255, 0.92) 0%, rgba(255, 247, 237, 0.86) 100%);
  }
}

@media (width <= 1024px) {
  .home {
    &__hero {
      grid-template-columns: 1fr;
    }

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
      margin-bottom: 16px;
      gap: 12px;
    }

    .home__hero-copy,
    .home__hero-panel {
      padding: 14px 12px;
      border-radius: $radius-md;
    }

    .home__hero-actions {
      gap: 8px;
      margin-bottom: 12px;
    }

    .home__btn {
      padding: 8px 12px;
      font-size: 0.8rem;
    }

    .home__metrics {
      grid-template-columns: 1fr 1fr;
    }

    .home__metric {
      padding: 8px;
    }

    .home__cards {
      grid-template-columns: 1fr;
      gap: 12px;
      margin-bottom: 16px;
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
      margin-top: 16px;
      padding-top: 14px;
    }

    .home__foot-text {
      font-size: 0.85rem;
    }

    .home__section-head {
      margin-bottom: 10px;
    }
  }
}
</style>
