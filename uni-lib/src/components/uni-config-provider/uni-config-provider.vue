<script setup lang="ts">
import { ElConfigProvider } from "element-plus";
import { computed } from "vue";

import { resolveElementPlusLocale } from "@/services/element-plus-locale";
import { useUniI18n, useUniLocaleRef } from "@/services/i18n";

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
