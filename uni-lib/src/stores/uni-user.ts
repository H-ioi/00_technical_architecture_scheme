import { defineStore } from "pinia";
import { computed, ref } from "vue";

import { getUniRuntimeConfig } from "@/runtime/config";
import { storage } from "@/plugins/storage";
import type { UniUserProfile } from "@/types/user-profile";
import { usePermissionStore } from "@/stores/uni-permission";

export const useUserStore = defineStore("user", () => {
  const accessToken = ref(storage.get<string>("access-token") ?? "");
  const profile = ref<UniUserProfile | null>(
    storage.get<UniUserProfile>("user-profile"),
  );

  const isLoggedIn = computed(() => Boolean(accessToken.value));

  const setToken = (token: string) => {
    accessToken.value = token;
    storage.set("access-token", token);
  };

  const setProfile = (nextProfile: UniUserProfile | null) => {
    profile.value = nextProfile;

    if (nextProfile) {
      storage.set("user-profile", nextProfile);
    } else {
      storage.remove("user-profile");
    }
  };

  const login = async (params: unknown) => {
    const result = await getUniRuntimeConfig().auth.login(params);
    const permissionStore = usePermissionStore();

    setToken(result.accessToken);
    setProfile(result.user);
    permissionStore.setPermissionCodes(result.permissions);

    return result;
  };

  const logout = async () => {
    if (accessToken.value) {
      await getUniRuntimeConfig().auth.logoutRequest?.().catch(() => undefined);
    }

    resetAuth();
  };

  const resetAuth = () => {
    const permissionStore = usePermissionStore();

    accessToken.value = "";
    profile.value = null;
    permissionStore.resetPermission();
    storage.remove("access-token");
    storage.remove("user-profile");
  };

  return {
    accessToken,
    profile,
    isLoggedIn,
    login,
    logout,
    resetAuth,
    setToken,
    setProfile,
  };
});
