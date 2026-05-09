import { defineStore } from "pinia";
import { computed, ref } from "vue";

import type { UniAppMenuRecord } from "@/types/admin-route";
import { storage } from "@/plugins/storage";

export const usePermissionStore = defineStore("permission", () => {
  const menus = ref<UniAppMenuRecord[]>([]);
  const permissionCodes = ref<string[]>(
    storage.get<string[]>("permission-codes") ?? [],
  );
  const allowedPaths = ref<string[]>(
    storage.get<string[]>("allowed-paths") ?? [],
  );
  const dynamicRoutesLoaded = ref(false);
  const permissionVersion = ref(0);

  const menuRoutes = computed(() =>
    menus.value.filter((route) => !route.meta?.hidden),
  );

  const setMenus = (nextMenus?: UniAppMenuRecord[]) => {
    menus.value = Array.isArray(nextMenus) ? nextMenus : [];
  };

  const setPermissionCodes = (nextCodes?: string[]) => {
    permissionCodes.value = Array.isArray(nextCodes) ? nextCodes : [];
    permissionVersion.value += 1;
    storage.set("permission-codes", permissionCodes.value);
  };

  const setAllowedPaths = (nextPaths?: string[]) => {
    allowedPaths.value = Array.isArray(nextPaths) ? nextPaths : [];
    storage.set("allowed-paths", allowedPaths.value);
  };

  const hasPermission = (permission?: string | string[]) => {
    if (!permission) {
      return true;
    }

    const requiredPermissions = Array.isArray(permission)
      ? permission
      : [permission];
    const codes = Array.isArray(permissionCodes.value)
      ? permissionCodes.value
      : [];

    return requiredPermissions.some((code) => codes.includes(code));
  };

  const canAccessPath = (path?: string) => {
    if (!path) {
      return true;
    }

    return allowedPaths.value.includes(path);
  };

  const markDynamicRoutesLoaded = () => {
    dynamicRoutesLoaded.value = true;
  };

  const resetPermission = () => {
    menus.value = [];
    permissionCodes.value = [];
    allowedPaths.value = [];
    dynamicRoutesLoaded.value = false;
    permissionVersion.value += 1;
    storage.remove("permission-codes");
    storage.remove("allowed-paths");
  };

  return {
    menus,
    menuRoutes,
    allowedPaths,
    permissionCodes,
    permissionVersion,
    dynamicRoutesLoaded,
    canAccessPath,
    hasPermission,
    markDynamicRoutesLoaded,
    resetPermission,
    setAllowedPaths,
    setMenus,
    setPermissionCodes,
  };
});
