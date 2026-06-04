<!--
  全局语言切换：方框描边按钮，文案为「下一语言」短标签（如当前中文则显示 En）。
  在 main.ts 注册为 LocaleToggle；也可直接 import 使用。
-->
<template>
  <view
    class="locale-toggle"
    :class="theme === 'dark' ? 'locale-toggle--dark' : 'locale-toggle--light'"
    role="button"
    @click.stop="handleToggle"
  >
    <text class="locale-toggle__label">{{ nextLocaleShortLabel }}</text>
  </view>
</template>

<script setup lang="ts">
import { useLocaleSwitcher } from "@/composables/use-locale";

withDefaults(
  defineProps<{
    /** light：浅底页面；dark：深色顶栏（白字白边） */
    theme?: "light" | "dark";
  }>(),
  {
    theme: "light",
  },
);

const { cycleLocale, nextLocaleShortLabel } = useLocaleSwitcher();

function handleToggle() {
  cycleLocale();
}
</script>

<style scoped lang="scss">
.locale-toggle {
  width: 52rpx;
  height: 52rpx;
  box-sizing: border-box;
  border-radius: 4rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &__label {
    font-size: 30rpx;
    font-weight: 400;
    line-height: 1;
    letter-spacing: 0.02em;
  }

  &--light {
    background: transparent;
    border: 1rpx solid #333;

    .locale-toggle__label {
      color: #333;
    }
  }

  &--dark {
    background: transparent;
    border: 1rpx solid rgba(255, 255, 255, 0.88);

    .locale-toggle__label {
      color: #fff;
    }
  }
}
</style>
