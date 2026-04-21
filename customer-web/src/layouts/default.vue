<template>
  <div class="shell mob--ex-shell">
    <header class="shell__header">
      <div class="shell__inner">
        <NuxtLink to="/" class="shell__brand">
          <span class="shell__logo" aria-hidden="true" />
          <span class="shell__title">Nuxt 案例模版</span>
        </NuxtLink>
        <nav class="shell__nav" aria-label="主导航">
          <NuxtLink class="shell__link" to="/">首页</NuxtLink>
          <NuxtLink class="shell__link" to="/examples/components">组件</NuxtLink>
          <NuxtLink class="shell__link" to="/examples/data-fetch">模拟接口</NuxtLink>
          <NuxtLink class="shell__link" to="/examples/layout-alt">备选布局</NuxtLink>
        </nav>
      </div>
    </header>
    <main class="shell__main">
      <div class="shell__content">
        <slot />
      </div>
    </main>
  </div>
</template>

<style scoped lang="scss">
.shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: transparent;

  &__header {
    position: sticky;
    top: 0;
    z-index: 60;
    background: rgba(255, 255, 255, 0.88);
    border-bottom: 1px solid $color-border;
    backdrop-filter: blur(14px);
    box-shadow: $shadow-sm;
  }

  &__inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    max-width: 1152px;
    margin: 0 auto;
    padding: 14px 22px;
  }

  &__brand {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
    color: $color-text;

    &:hover {
      .shell__title {
        color: $color-primary-strong;
      }
    }
  }

  &__logo {
    width: 12px;
    height: 12px;
    border-radius: $radius-full;
    background: linear-gradient(140deg, $color-primary 0%, $color-accent 100%);
    box-shadow: 0 0 0 4px $color-primary-soft;
  }

  &__title {
    font-size: 1rem;
    font-weight: 700;
    letter-spacing: -0.01em;
    transition: color 0.15s ease;
  }

  &__nav {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px;
    background: rgba(255, 255, 255, 0.68);
    border-radius: $radius-full;
    border: 1px solid $color-border;
  }

  &__link {
    padding: 8px 12px;
    font-size: 0.82rem;
    font-weight: 500;
    color: $color-text-muted;
    text-decoration: none;
    border-radius: $radius-full;
    transition:
      color 0.15s ease,
      background 0.15s ease;

    &:hover {
      color: $color-text;
      background: rgba(59, 130, 246, 0.08);
    }

    &.router-link-active {
      color: $color-primary-strong;
      background: rgba(59, 130, 246, 0.12);
      box-shadow: $shadow-sm;
      font-weight: 600;
    }
  }

  &__main {
    flex: 1;
    padding: 26px 18px 48px;
  }

  &__content {
    max-width: 1152px;
    margin: 0 auto;
  }
}

@media (width <= 768px) {
  .mob--ex-shell {
    .shell__header {
      position: static;
      backdrop-filter: none;
    }

    .shell__inner {
      flex-wrap: wrap;
      gap: 12px;
      padding: 12px 14px;
    }

    .shell__title {
      font-size: 0.94rem;
    }

    .shell__nav {
      width: 100%;
      overflow-x: auto;
      justify-content: flex-start;
      white-space: nowrap;
      border-radius: $radius-md;
    }

    .shell__link {
      flex: 0 0 auto;
      padding: 9px 12px;
      font-size: 0.84rem;
    }

    .shell__main {
      padding: 18px 10px 30px;
    }
  }
}
</style>
