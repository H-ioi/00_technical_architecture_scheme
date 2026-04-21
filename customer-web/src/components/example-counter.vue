<template>
  <div class="ex-counter">
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
  padding: 6px 8px 6px 12px;
  border-radius: $radius-full;
  background: $color-surface-muted;
  border: 1px solid $color-border;
  box-shadow: $shadow-sm;
}

.ex-counter__label {
  font-size: 0.75rem;
  font-weight: 600;
  color: $color-text-subtle;
  letter-spacing: 0.04em;
}

.ex-counter__btn {
  width: 34px;
  height: 34px;
  border: none;
  border-radius: $radius-full;
  background: $color-surface;
  color: $color-text;
  cursor: pointer;
  font-size: 1.125rem;
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

.ex-counter__value {
  min-width: 2.5ch;
  padding: 0 6px;
  font-variant-numeric: tabular-nums;
  font-weight: 700;
  font-size: 1.0625rem;
  color: $color-text;
}
</style>
