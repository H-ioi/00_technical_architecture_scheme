<template>
  <div class="statusBox df_start_center">
    <div
      :class="['statusItem', { currentStatusItem: currentstatus == i.type }]"
      v-for="(i, k) in statusList"
      :key="k"
      @click="changeStasus(i, k)"
    >
      {{
        $route.path.indexOf("thepool") == -1 ? i.name : $t("consult")[i.name]
      }}
    </div>
  </div>
</template>

<script>
export default {
  name: "PCOrderStatusItem",
  props: {
    statusList: Array,
    currentstatus: String,
  },
  data() {
    return {};
  },

  mounted() {},

  methods: {
    changeStasus(i, k) {
      this.$emit("changeStasus", i, k);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>