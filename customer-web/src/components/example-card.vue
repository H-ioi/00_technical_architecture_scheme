<template>
  <article class="ex-card mob--ex-card" :data-variant="variant">
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

  &[data-variant='accent'] {
    border-color: rgba(59, 130, 246, 0.32);
    background: linear-gradient(165deg, rgba(239, 246, 255, 0.95) 0%, rgba(255, 255, 255, 1) 60%);
    box-shadow:
      $shadow-sm,
      0 0 0 1px rgba(59, 130, 246, 0.08) inset;

    &:hover {
      border-color: rgba(59, 130, 246, 0.46);
    }

    .ex-card__head {
      background: linear-gradient(90deg, rgba(59, 130, 246, 0.1) 0%, transparent 16%);
      border-bottom-color: rgba(59, 130, 246, 0.14);
    }

    .ex-card__title {
      border-left-color: $color-primary;
    }
  }

  &__head {
    padding: 12px 14px;
    border-bottom: 1px solid $color-border;
    background: linear-gradient(90deg, $color-primary-soft 0%, transparent 18%);
  }

  &__title {
    margin: 0;
    padding-left: 9px;
    border-left: 3px solid $color-primary;
    font-size: 0.95rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: $color-text;
  }

  &__body {
    padding: 14px;
    font-size: 0.95rem;
    color: $color-text-muted;
    line-height: 1.6;
  }
}

@media (width <= 768px) {
  .mob--ex-card {
    border-radius: $radius-md;

    .ex-card__head {
      padding: 11px 12px;
    }

    .ex-card__title {
      font-size: 0.9rem;
    }

    .ex-card__body {
      padding: 12px;
      font-size: 0.9rem;
    }
  }
}
</style>
