<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
import { applyTabBarTexts } from "@/locales";

onLaunch(() => {
  applyTabBarTexts();
});

onShow(() => {
  // Keep lifecycle hooks for analytics/session resume.
});

onHide(() => {
  // Keep lifecycle hooks for cleanup/reporting.
});
</script>

<style lang="scss">
@use "./app.scss";
</style>
