import { defineStore } from "pinia";
import { ref } from "vue";

export const useAppStore = defineStore("app", () => {
  const appReady = ref(false);

  function setAppReady(ready: boolean) {
    appReady.value = ready;
  }

  return {
    appReady,
    setAppReady,
  };
});
