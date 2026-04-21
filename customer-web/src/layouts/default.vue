<template>
  <div class="shell">
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
}

.shell__header {
  position: sticky;
  top: 0;
  z-index: 40;
  background: rgba(255, 255, 255, 0.82);
  border-bottom: 1px solid $color-border;
  backdrop-filter: blur(12px);
  box-shadow: $shadow-sm;
}

.shell__inner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  max-width: 72rem;
  margin: 0 auto;
  padding: 14px 24px;
}

.shell__brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: $color-text;

  &:hover .shell__title {
    color: $color-primary-strong;
  }
}

.shell__logo {
  width: 10px;
  height: 10px;
  border-radius: $radius-full;
  background: linear-gradient(135deg, $color-primary 0%, #6366f1 100%);
  box-shadow: 0 0 0 3px $color-primary-soft;
}

.shell__title {
  font-size: 1.0625rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  transition: color 0.15s ease;
}

.shell__nav {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  padding: 4px;
  background: $color-surface-muted;
  border-radius: $radius-full;
  border: 1px solid $color-border;
}

.shell__link {
  padding: 8px 14px;
  font-size: 0.8125rem;
  font-weight: 500;
  color: $color-text-muted;
  text-decoration: none;
  border-radius: $radius-full;
  transition:
    color 0.15s ease,
    background 0.15s ease;

  &:hover {
    color: $color-text;
    background: rgba(255, 255, 255, 0.9);
  }

  &.router-link-active {
    color: $color-text;
    background: $color-surface;
    box-shadow: $shadow-sm;
    font-weight: 600;
  }
}

.shell__main {
  flex: 1;
  padding: 28px 20px 56px;
}

.shell__content {
  max-width: 72rem;
  margin: 0 auto;
}
</style>
