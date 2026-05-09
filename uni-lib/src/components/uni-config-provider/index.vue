<template>
  <el-config-provider :locale="epLocale">
    <slot />
  </el-config-provider>
</template>

<script setup lang="ts">
/**
 * 全局配置容器：将 vue-i18n 当前语言同步到 Element Plus 的 `locale`，
 * 使表格分页、日期等组件的内置文案与业务 i18n 一致。
 */
import en from "element-plus/es/locale/lang/en.mjs";
import zhCn from "element-plus/es/locale/lang/zh-cn.mjs";
import { ElConfigProvider } from "element-plus";
import { computed } from "vue";
import { useI18n } from "vue-i18n";

type ElementPlusLocale = typeof zhCn;

function resolveElementPlusLocale(
  code: string | undefined | null,
): ElementPlusLocale {
  if (code == null || code === "") {
    return zhCn;
  }

  const normalized = String(code).toLowerCase().replace(/_/g, "-");

  if (normalized === "en" || normalized.startsWith("en-")) {
    return en;
  }

  if (normalized.startsWith("zh")) {
    return zhCn;
  }

  return zhCn;
}

const { locale } = useI18n({ useScope: "global" });

const epLocale = computed(() => resolveElementPlusLocale(locale.value));
</script>

<style scoped lang="scss"></style>
