<template>
  <view class="app-page mine-page">
    <view class="app-card">
      <section-title :title="t('mine.title')" />

      <view class="mine-page__row">
        <text class="mine-page__label">{{ t("mine.nicknameLabel") }}</text>
        <text class="mine-page__value">{{ nickname }}</text>
      </view>

      <button class="mine-page__button" :loading="loading" @click="loadProfile">
        {{ t("mine.refreshProfile") }}
      </button>

      <view class="mine-page__locale">
        <text class="mine-page__locale-title">{{ t("mine.localeTitle") }}</text>
        <view class="mine-page__locale-row">
          <button
            v-for="item in localeOptions"
            :key="item.value"
            class="mine-page__locale-btn"
            size="mini"
            @click="setLocale(item.value)"
          >
            {{ item.label }}
          </button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import SectionTitle from "@/components/common/section-title.vue";
import { useLocaleSwitcher } from "@/composables/use-locale";
import { useNavigationTitle } from "@/composables/use-navigation-title";
import { useUserProfile } from "@/composables/use-user-profile";

useNavigationTitle("nav.mineTitle");

const { t } = useI18n();
const { loading, profile, loadProfile } = useUserProfile();
const { localeOptions, setLocale } = useLocaleSwitcher();

const nickname = computed(() => profile.value?.nickname ?? t("mine.guest"));

onMounted(() => {
  loadProfile();
});
</script>

<style scoped lang="scss">
.mine-page {
  padding: 24rpx;

  &__row {
    display: flex;
    margin-bottom: 24rpx;
    font-size: 28rpx;
  }

  &__label {
    color: #6b7280;
  }

  &__value {
    color: #111827;
    font-weight: 500;
  }

  &__button {
    width: 100%;
    margin-bottom: 32rpx;
  }

  &__locale-title {
    display: block;
    margin-bottom: 16rpx;
    font-size: 28rpx;
    color: #374151;
    font-weight: 500;
  }

  &__locale-row {
    display: flex;
    flex-wrap: wrap;
    gap: 16rpx;
  }

  &__locale-btn {
    margin: 0;
  }
}
</style>
