<template>
  <view class="app-page home-page">
    <view class="home-page__toolbar">
      <locale-toggle />
    </view>
    <view class="app-card">
      <section-title :title="t('home.title')" />
      <text class="home-page__desc">
        {{ t("home.statusPrefix") }}：{{ statusText }}
      </text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onShow } from "@dcloudio/uni-app";
import SectionTitle from "@/components/common/section-title.vue";
import { useAppStore } from "@/stores";
import { computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

onShow(() => {
  uni.setNavigationBarTitle({ title: String(t("nav.homeTitle")) });
});
const appStore = useAppStore();

const statusText = computed(() =>
  appStore.appReady ? t("home.ready") : t("home.initializing"),
);

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
