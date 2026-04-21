<template>
  <section :class="['page', 'mob--ex-page', `page--${theme}`]">
    <header class="page__intro">
      <p class="ex-eyebrow">Layout</p>
      <h1 class="ex-h1">备选布局案例</h1>
      <p class="ex-lead">
        本页使用 <span class="ex-code">definePageMeta({ layout: 'demo' })</span> 加载
        <span class="ex-code">src/layouts/demo.vue</span>，与默认顶栏区分视觉与宽度。
      </p>
    </header>

    <ExampleCard title="何时使用">
      <p class="page__p">
        默认站点壳子用 <span class="ex-code">layouts/default.vue</span>；若需要独立营销页、登录页、文档区等，可为单页切换 layout，互不干扰全局导航样式。
      </p>
    </ExampleCard>
  </section>
</template>

<script setup lang="ts">
const theme = useState<'brand' | 'campaign'>('site-theme', () => 'brand')

definePageMeta({
  layout: 'demo'
})
</script>

<style scoped lang="scss">
.page {
  &__intro {
    margin-bottom: 24px;
  }

  &__p {
    margin: 0;
    line-height: 1.65;
  }
}

.page--campaign {
  .page__p {
    color: #7f1d1d;
  }
}

@media (max-width: 768px) {
  .mob--ex-page {
    .page__intro {
      margin-bottom: 18px;
    }

    .page__p {
      font-size: 0.9rem;
      line-height: 1.65;
    }
  }
}
</style>
