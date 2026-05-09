<script setup lang="ts">
/**
 * 全局配置容器：将 uni-lib 当前语言同步到 Element Plus 的 `locale`，
 * 使表格分页、日期等组件的内置文案与业务 i18n 一致。
 */
import { ElConfigProvider } from "element-plus";
import { computed } from "vue";

import { resolveElementPlusLocale } from "@/plugins/element-plus-locale";
import { useUniI18n, useUniLocaleRef } from "@/locales/i18n";

const i18n = useUniI18n();
const localeRef = useUniLocaleRef();

const locale = computed(() => {
  const code = localeRef?.value ?? i18n.locale();

  return resolveElementPlusLocale(code);
});
</script>

<template>
  <el-config-provider :locale="locale">
    <slot />
  </el-config-provider>
</template>
