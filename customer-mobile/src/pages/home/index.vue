<template>
  <view class="app-page home-page">
    <view class="home-page__toolbar">
      <locale-toggle />
    </view>
    <view class="app-card">
      <section-title :title="t('home.title')" />
      <text class="home-page__desc">
        {{ t("home.platformPrefix") }}：{{ platformText }} | {{ t("home.statusPrefix") }}：{{ statusText }}
      </text>
    </view>
  </view>
</template>

<script setup lang="ts">
import SectionTitle from "@/components/common/section-title.vue";
import { useNavigationTitle } from "@/composables/use-navigation-title";
import { useAppStore } from "@/stores";
import { getPlatformName, isH5, isWeapp } from "@/utils/modules/platform";
import { computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";

useNavigationTitle("nav.homeTitle");

const { t } = useI18n();
const appStore = useAppStore();

const statusText = computed(() =>
  appStore.appReady ? t("home.ready") : t("home.initializing"),
);

const platformText = computed(() => {
  if (isWeapp()) {
    return t("home.platformWechat");
  }

  if (isH5()) {
    return t("home.platformH5");
  }

  return getPlatformName();
});

onMounted(() => {
  appStore.setAppReady(true);
});
</script>

<style scoped lang="scss">
.home-page {
  padding: 24rpx;

  &__toolbar {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 24rpx;
  }

  &__desc {
    font-size: 28rpx;
    color: $theme-color-text-secondary;
    line-height: 1.6;
  }
}
</style>
