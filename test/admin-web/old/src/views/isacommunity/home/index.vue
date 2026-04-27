<template>
  <div>
    <div><img width="100%" :src="`/community/home_${i18nlocel}.png`" alt="" /></div>
    <div class="df_center">
      <img width="680px" :src="`/community/home_empty_${i18nlocel}.png`" alt="" />
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["i18nlocel"]),
  },
};
</script>
