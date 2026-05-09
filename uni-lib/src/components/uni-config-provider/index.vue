<script setup lang="ts">
/**
 * 全局配置容器：将 vue-i18n 当前语言同步到 Element Plus 的 `locale`，
 * 使表格分页、日期等组件的内置文案与业务 i18n 一致。
 */
import { ElConfigProvider } from "element-plus";
import { computed } from "vue";
import { useI18n } from "vue-i18n";

import { resolveElementPlusLocale } from "@/plugins/element-plus-locale";

const { locale } = useI18n({ useScope: "global" });

const epLocale = computed(() => resolveElementPlusLocale(locale.value));
</script>

<template>
  <el-config-provider :locale="epLocale">
    <slot />
  </el-config-provider>
</template>
