<template>
  <article class="ex-card" :data-variant="variant">
    <div v-if="title" class="ex-card__head">
      <h3 class="ex-card__title">{{ title }}</h3>
    </div>
    <div class="ex-card__body">
      <slot />
    </div>
  </article>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
    variant?: 'default' | 'accent'
  }>(),
  {
    title: '',
    variant: 'default'
  }
)
</script>

<style scoped lang="scss">
.ex-card {
  overflow: hidden;
  border-radius: $radius-lg;
  border: 1px solid $color-border;
  background: $color-surface;
  box-shadow: $shadow-sm;
  transition:
    box-shadow 0.2s ease,
    border-color 0.2s ease;

  &:hover {
    box-shadow: $shadow-md;
  }
}

.ex-card[data-variant='accent'] {
  border-color: rgba(99, 102, 241, 0.28);
  background: linear-gradient(165deg, rgba(238, 242, 255, 0.95) 0%, rgba(255, 255, 255, 1) 55%);
  box-shadow:
    $shadow-sm,
    0 0 0 1px rgba(99, 102, 241, 0.06) inset;

  &:hover {
    border-color: rgba(99, 102, 241, 0.4);
  }

  .ex-card__head {
    background: linear-gradient(90deg, rgba(99, 102, 241, 0.08) 0%, transparent 14%);
    border-bottom-color: rgba(99, 102, 241, 0.12);
  }
}

.ex-card__head {
  padding: 12px 16px 10px 14px;
  border-bottom: 1px solid $color-border;
  background: linear-gradient(90deg, $color-primary-soft 0%, transparent 12%);
}

.ex-card__title {
  margin: 0;
  padding-left: 10px;
  border-left: 3px solid $color-primary;
  font-size: 0.9375rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: $color-text;
}

.ex-card[data-variant='accent'] .ex-card__title {
  border-left-color: #6366f1;
}

.ex-card__body {
  padding: 16px 18px 18px;
  font-size: 0.9375rem;
  color: $color-text-muted;
  line-height: 1.6;
}
</style>
