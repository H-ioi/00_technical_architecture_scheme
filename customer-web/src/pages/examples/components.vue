<template>
  <section class="page">
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
.page__intro {
  margin-bottom: 28px;
}

.page__grid {
  display: grid;
  gap: 18px;
  margin-bottom: 22px;

  @media (min-width: 640px) {
    grid-template-columns: 1fr 1fr;
  }
}

.page__muted {
  margin: 0 0 14px;
  font-size: 0.875rem;
  color: $color-text-muted;
}

.page__foot {
  margin: 16px 0 0;
  padding-top: 14px;
  border-top: 1px dashed $color-border;
  font-size: 0.9375rem;
  color: $color-text-muted;
}

.page__strong {
  color: $color-primary-strong;
  font-size: 1.125rem;
}
</style>
