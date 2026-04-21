<template>
  <section class="page mob--ex-page">
    <header class="page__intro">
      <p class="ex-eyebrow">Components</p>
      <h1 class="ex-h1">组件案例</h1>
      <p class="ex-lead">
        以下为自动导入示例：磁盘文件为 <span class="ex-code">example-card.vue</span>、
        <span class="ex-code">example-counter.vue</span>（模板中仍写
        <span class="ex-code">&lt;ExampleCard /&gt;</span> 等 PascalCase），源码在
        <span class="ex-code">src/components/</span>。
      </p>
    </header>

    <div class="page__grid">
      <ExampleCard title="卡片 · 默认样式">
        插槽内容：任意文案或子组件。
      </ExampleCard>

      <ExampleCard title="卡片 · 强调样式" variant="accent">
        通过 <span class="ex-code">variant="accent"</span> 切换局部样式。
      </ExampleCard>
    </div>

    <ExampleCard title="父子通信 · 计数器">
      <p class="page__muted">子组件通过 <span class="ex-code">emit('change', value)</span> 把数值交给父级。</p>
      <ExampleCounter :initial="0" @change="onCount" />
      <p class="page__foot">
        父级当前值：<strong class="page__strong">{{ lastCount }}</strong>
      </p>
    </ExampleCard>
  </section>
</template>

<script setup lang="ts">
const lastCount = ref(0)

function onCount (n: number) {
  lastCount.value = n
}
</script>

<style scoped lang="scss">
.page {
  &__intro {
    margin-bottom: 26px;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
    margin-bottom: 16px;
  }

  &__muted {
    margin: 0 0 14px;
    font-size: 0.88rem;
    color: $color-text-muted;
  }

  &__foot {
    margin: 16px 0 0;
    padding-top: 14px;
    border-top: 1px dashed $color-border;
    font-size: 0.9rem;
    color: $color-text-muted;
  }

  &__strong {
    color: $color-primary-strong;
    font-size: 1.05rem;
  }
}

@media (width <= 768px) {
  .mob--ex-page {
    .page__intro {
      margin-bottom: 18px;
    }

    .page__grid {
      grid-template-columns: 1fr;
      gap: 12px;
      margin-bottom: 12px;
    }

    .page__muted {
      margin-bottom: 12px;
      font-size: 0.85rem;
    }

    .page__foot {
      margin-top: 10px;
      padding-top: 10px;
      font-size: 0.85rem;
    }

    .page__strong {
      font-size: 0.98rem;
    }
  }
}
</style>
