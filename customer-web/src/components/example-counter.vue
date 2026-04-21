<template>
  <div class="ex-counter mob--ex-counter">
    <span class="ex-counter__label">计数</span>
    <button type="button" class="ex-counter__btn" aria-label="减一" @click="dec">
      −
    </button>
    <output class="ex-counter__value" aria-live="polite">{{ model }}</output>
    <button type="button" class="ex-counter__btn" aria-label="加一" @click="inc">
      +
    </button>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{ initial?: number }>(), {
  initial: 0
})

const emit = defineEmits<{
  change: [value: number]
}>()

const model = ref(props.initial)

watch(model, (v) => emit('change', v))

function inc () {
  model.value += 1
}

function dec () {
  model.value -= 1
}
</script>

<style scoped lang="scss">
.ex-counter {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 7px 8px 7px 12px;
  border-radius: $radius-full;
  background: $color-surface-muted;
  border: 1px solid $color-border;
  box-shadow: $shadow-sm;

  &__label {
    font-size: 0.72rem;
    font-weight: 600;
    color: $color-text-subtle;
    letter-spacing: 0.04em;
  }

  &__btn {
    width: 32px;
    height: 32px;
    border: none;
    border-radius: $radius-full;
    background: $color-surface;
    color: $color-text;
    cursor: pointer;
    font-size: 1rem;
    line-height: 1;
    box-shadow: $shadow-sm;
    transition:
      background 0.15s ease,
      transform 0.1s ease;

    &:hover {
      background: $color-primary-soft;
      color: $color-primary-strong;
    }

    &:active {
      transform: scale(0.94);
    }

    &:focus-visible {
      outline: 2px solid $color-primary;
      outline-offset: 2px;
    }
  }

  &__value {
    min-width: 2.5ch;
    padding: 0 6px;
    font-variant-numeric: tabular-nums;
    font-weight: 700;
    font-size: 0.98rem;
    color: $color-text;
  }
}

@media (width <= 768px) {
  .mob--ex-counter {
    width: 100%;
    justify-content: center;
    gap: 10px;
    padding: 10px 12px;

    .ex-counter__label {
      font-size: 0.8rem;
    }

    .ex-counter__btn {
      width: 34px;
      height: 34px;
      font-size: 1.05rem;
    }

    .ex-counter__value {
      padding: 0 8px;
      font-size: 1rem;
    }
  }
}
</style>
