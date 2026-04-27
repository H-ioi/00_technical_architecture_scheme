<template>
  <div class="detail_top_left df_sb">
    <div class="back_btn" @click="back">
      <img src="/svg/other/fanhui.svg" alt="" />
    </div>
    <span>{{ $route.name }}</span>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    back() {
      this.$store.commit("CLOSE_TAG_CURRENT", this.$route.fullPath);
      this.$router.back();
    },
  },
};
</script>