import { defineStore } from "pinia";
import { computed, ref } from "vue";

import { tryGetUniConfig } from "@/plugins/config";
import { storage } from "@/plugins/storage";

export const useAppStore = defineStore("app", () => {
  const sidebarCollapsed = ref(
    storage.get<boolean>("sidebar-collapsed") ?? false,
  );

  const locale = ref<string>(
    storage.get<string>("locale") ??
      tryGetUniConfig()?.defaultLocale ??
      "zh-CN",
  );

  const sidebarWidth = computed(() =>
    sidebarCollapsed.value ? "64px" : "220px",
  );

  const toggleSidebar = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value;
    storage.set("sidebar-collapsed", sidebarCollapsed.value);
  };

  const setLocale = (nextLocale: string) => {
    locale.value = nextLocale;
    storage.set("locale", nextLocale);
  };

  return {
    sidebarCollapsed,
    sidebarWidth,
    locale,
    setLocale,
    toggleSidebar,
  };
});
