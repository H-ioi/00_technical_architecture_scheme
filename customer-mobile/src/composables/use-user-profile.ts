import { fetchUserProfile } from "@/services/modules/user";
import type { UserProfile } from "@/types/modules/user";
import { ref } from "vue";

export function useUserProfile() {
  const loading = ref(false);
  const profile = ref<UserProfile | null>(null);

  async function loadProfile() {
    loading.value = true;
    try {
      const response = await fetchUserProfile();
      profile.value = response.data;
    } finally {
      loading.value = false;
    }
  }

  return {
    loading,
    profile,
    loadProfile,
  };
}
