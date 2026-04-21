<template>
  <div :class="['alt', 'mob--ex-alt', `alt--${theme}`]">
    <header class="alt__header">
      <div class="alt__bar">
        <span class="alt__badge">备选布局</span>
        <nav class="alt__nav" aria-label="备选布局导航">
          <NuxtLink to="/">首页</NuxtLink>
          <NuxtLink to="/examples/components">组件</NuxtLink>
          <NuxtLink to="/examples/data-fetch">接口</NuxtLink>
          <NuxtLink to="/examples/layout-alt">关于本页</NuxtLink>
        </nav>
        <div class="alt__themes">
          <button
            type="button"
            class="alt__theme-btn"
            :class="{ 'is-active': theme === 'brand' }"
            @click="theme = 'brand'"
          >
            官网风
          </button>
          <button
            type="button"
            class="alt__theme-btn"
            :class="{ 'is-active': theme === 'campaign' }"
            @click="theme = 'campaign'"
          >
            营销风
          </button>
        </div>
      </div>
    </header>
    <main class="alt__main">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const theme = useState<'brand' | 'campaign'>('site-theme', () => 'brand')
</script>

<style scoped lang="scss">
.alt {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background:
    radial-gradient(ellipse 110% 85% at 50% -30%, rgba(59, 130, 246, 0.16), transparent 60%),
    linear-gradient(175deg, #eff6ff 0%, #f3e8ff 40%, #f8fafc 100%);

  &__header {
    padding: 18px 16px 0;
  }

  &__bar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    max-width: 760px;
    margin: 0 auto;
    padding: 14px 16px;
    background: rgba(255, 255, 255, 0.76);
    border: 1px solid rgba(255, 255, 255, 0.92);
    border-radius: $radius-lg;
    box-shadow: $shadow-md;
    backdrop-filter: blur(10px);
  }

  &__badge {
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 6px 12px;
    border-radius: $radius-full;
    background: linear-gradient(135deg, $color-primary 0%, $color-accent 100%);
    color: #fff;
    box-shadow: 0 2px 12px rgba(99, 102, 241, 0.35);
  }

  &__nav {
    display: flex;
    flex-wrap: wrap;
    gap: 10px 14px;

    a {
      font-size: 0.82rem;
      font-weight: 500;
      color: #475569;
      text-decoration: none;

      &:hover {
        color: $color-primary-strong;
      }

      &.router-link-active {
        font-weight: 700;
        color: $color-primary-strong;
      }
    }
  }

  &__main {
    flex: 1;
    width: 100%;
    max-width: 760px;
    margin: 0 auto;
    padding: 24px 16px 42px;
  }

  &__themes {
    display: inline-flex;
    gap: 6px;
    padding: 3px;
    border: 1px solid rgba(255, 255, 255, 0.9);
    border-radius: $radius-full;
    background: rgba(255, 255, 255, 0.6);
  }

  &__theme-btn {
    border: none;
    background: transparent;
    color: $color-text-muted;
    border-radius: $radius-full;
    padding: 6px 10px;
    font-size: 0.72rem;
    line-height: 1;
    cursor: pointer;

    &.is-active {
      color: $color-primary-strong;
      font-weight: 700;
      background: rgba(59, 130, 246, 0.12);
    }
  }
}

.alt--campaign {
  background:
    radial-gradient(ellipse 110% 85% at 50% -30%, rgba(244, 114, 182, 0.2), transparent 60%),
    linear-gradient(175deg, #fff1f2 0%, #ffedd5 40%, #fff7ed 100%);

  .alt__theme-btn.is-active {
    color: #be185d;
    background: rgba(236, 72, 153, 0.12);
  }

  .alt__badge {
    background: linear-gradient(135deg, #f97316 0%, #ec4899 100%);
  }
}

@media (width <= 768px) {
  .mob--ex-alt {
    .alt__header {
      padding: 12px 10px 0;
    }

    .alt__bar {
      padding: 12px;
      border-radius: $radius-md;
    }

    .alt__badge {
      font-size: 0.68rem;
      padding: 6px 10px;
    }

    .alt__nav {
      width: 100%;
      gap: 8px 12px;
    }

    .alt__main {
      padding: 16px 10px 28px;
    }

    .alt__themes {
      width: 100%;
      justify-content: center;
    }
  }
}
</style>
