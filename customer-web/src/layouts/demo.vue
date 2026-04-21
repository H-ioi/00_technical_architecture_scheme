<template>
  <div class="alt">
    <header class="alt__header">
      <div class="alt__bar">
        <span class="alt__badge">备选布局</span>
        <nav class="alt__nav" aria-label="备选布局导航">
          <NuxtLink to="/">首页</NuxtLink>
          <NuxtLink to="/examples/components">组件</NuxtLink>
          <NuxtLink to="/examples/data-fetch">接口</NuxtLink>
          <NuxtLink to="/examples/layout-alt">关于本页</NuxtLink>
        </nav>
      </div>
    </header>
    <main class="alt__main">
      <slot />
    </main>
  </div>
</template>

<style scoped lang="scss">
.alt {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background:
    radial-gradient(ellipse 100% 80% at 50% -30%, rgba(99, 102, 241, 0.15), transparent 55%),
    linear-gradient(175deg, #f5f3ff 0%, #eef2ff 35%, #f8fafc 100%);
}

.alt__header {
  padding: 20px 20px 0;
}

.alt__bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  max-width: 42rem;
  margin: 0 auto;
  padding: 14px 18px;
  background: rgba(255, 255, 255, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.9);
  border-radius: $radius-lg;
  box-shadow: $shadow-md;
  backdrop-filter: blur(10px);
}

.alt__badge {
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 6px 12px;
  border-radius: $radius-full;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: #fff;
  box-shadow: 0 2px 12px rgba(99, 102, 241, 0.35);
}

.alt__nav {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 18px;

  a {
    font-size: 0.8125rem;
    font-weight: 500;
    color: #475569;
    text-decoration: none;

    &:hover {
      color: #6366f1;
    }

    &.router-link-active {
      font-weight: 700;
      color: #312e81;
    }
  }
}

.alt__main {
  flex: 1;
  width: 100%;
  max-width: 42rem;
  margin: 0 auto;
  padding: 28px 20px 56px;
}
</style>
